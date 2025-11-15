#!/usr/bin/env node

const { Command } = require('commander');
const readline = require('readline');
const chalk = require('chalk');
const ora = require('ora');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Agent = require('./agent');
const tools = require('./tools');
const MCPIntegration = require('./mcp');

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('stick-gpt')
  .description('Local GPT agent with tool calling and MCP integrations')
  .version('1.0.0');

program
  .command('chat')
  .description('Start an interactive chat session')
  .option('-m, --model <model>', 'OpenAI model to use', process.env.MODEL || 'gpt-4o-mini')
  .option('-t, --temperature <temp>', 'Temperature for generation', process.env.TEMPERATURE || '0.7')
  .option('--no-tools', 'Disable built-in tools')
  .option('--mcp-config <path>', 'Path to MCP configuration file or directory')
  .option('-s, --system <prompt>', 'Custom system prompt')
  .action(async (options) => {
    try {
      console.log(chalk.blue.bold('\n🤖 Stick.GPT - Local GPT Agent\n'));

      // Initialize agent
      const config = {
        model: options.model,
        temperature: parseFloat(options.temperature),
        systemPrompt: options.system
      };

      const agent = new Agent(config);

      // Register built-in tools
      if (options.tools) {
        console.log(chalk.gray('Loading built-in tools...'));
        Object.values(tools).forEach(tool => {
          agent.registerTool(tool);
        });
        console.log(chalk.green(`✓ Loaded ${Object.keys(tools).length} built-in tools\n`));
      }

      // Load MCP configurations
      if (options.mcpConfig) {
        console.log(chalk.gray('Loading MCP configuration...'));
        const mcp = new MCPIntegration();
        
        const stats = fs.statSync(options.mcpConfig);
        if (stats.isDirectory()) {
          const result = mcp.loadConfigDirectory(options.mcpConfig);
          if (result.success) {
            console.log(chalk.green(`✓ ${result.message}\n`));
          } else {
            console.log(chalk.yellow(`⚠ ${result.error}\n`));
          }
        } else {
          const result = mcp.loadConfig(options.mcpConfig);
          if (result.success) {
            console.log(chalk.green(`✓ ${result.message}\n`));
          } else {
            console.log(chalk.yellow(`⚠ ${result.error}\n`));
          }
        }

        // Register MCP tools
        mcp.getTools().forEach(tool => {
          agent.registerTool(tool);
        });
      }

      console.log(chalk.gray(`Model: ${config.model}`));
      console.log(chalk.gray(`Tools: ${agent.tools.length} available\n`));
      console.log(chalk.yellow('Type your message or "exit" to quit, "reset" to clear conversation\n'));

      // Set up readline interface
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.cyan('You: ')
      });

      rl.prompt();

      rl.on('line', async (line) => {
        const input = line.trim();

        if (input.toLowerCase() === 'exit') {
          console.log(chalk.blue('\nGoodbye! 👋\n'));
          rl.close();
          process.exit(0);
        }

        if (input.toLowerCase() === 'reset') {
          agent.resetConversation();
          console.log(chalk.yellow('\n✓ Conversation reset\n'));
          rl.prompt();
          return;
        }

        if (!input) {
          rl.prompt();
          return;
        }

        const spinner = ora('Thinking...').start();

        try {
          const response = await agent.chat(input);
          spinner.stop();
          console.log(chalk.green('\nAssistant: ') + response + '\n');
        } catch (error) {
          spinner.stop();
          console.log(chalk.red(`\nError: ${error.message}\n`));
        }

        rl.prompt();
      });

      rl.on('close', () => {
        console.log(chalk.blue('\nGoodbye! 👋\n'));
        process.exit(0);
      });

    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('ask <question>')
  .description('Ask a single question and get a response')
  .option('-m, --model <model>', 'OpenAI model to use', process.env.MODEL || 'gpt-4o-mini')
  .option('--no-tools', 'Disable built-in tools')
  .action(async (question, options) => {
    try {
      const agent = new Agent({ model: options.model });

      if (options.tools) {
        Object.values(tools).forEach(tool => {
          agent.registerTool(tool);
        });
      }

      const spinner = ora('Thinking...').start();
      const response = await agent.chat(question);
      spinner.stop();

      console.log(chalk.green('\nAssistant: ') + response + '\n');
    } catch (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('tools')
  .description('List available tools')
  .action(() => {
    console.log(chalk.blue.bold('\n📦 Available Built-in Tools:\n'));
    Object.values(tools).forEach(tool => {
      console.log(chalk.cyan(`  ${tool.name}`) + chalk.gray(` - ${tool.description}`));
    });
    console.log();
  });

program
  .command('mcp-example')
  .description('Create an example MCP configuration file')
  .option('-o, --output <path>', 'Output path', './mcp-config.json')
  .action((options) => {
    const result = MCPIntegration.createExampleConfig(options.output);
    if (result.success) {
      console.log(chalk.green(`✓ ${result.message}`));
    } else {
      console.log(chalk.red(`✗ ${result.error}`));
    }
  });

// Show help if no command provided
if (process.argv.length === 2) {
  program.help();
}

program.parse();
