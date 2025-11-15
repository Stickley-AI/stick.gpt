# Quick Start Guide

Get started with stick.gpt in 5 minutes!

## Step 1: Installation

```bash
git clone https://github.com/Stickley-AI/stick.gpt.git
cd stick.gpt
npm install
```

## Step 2: Configuration

Create a `.env` file with your OpenAI API key:

```bash
cp .env.example .env
```

Edit `.env` and add your API key:
```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

## Step 3: Run Your First Command

### Option A: Interactive Chat

```bash
npm start
```

Or using the global command:
```bash
node cli.js chat
```

Example interaction:
```
You: What files are in the current directory?
Assistant: [The agent will use the list_directory tool to show you the files]

You: What time is it?
Assistant: [The agent will use the get_current_time tool to tell you the time]

You: exit
```

### Option B: Single Question

```bash
node cli.js ask "Explain what this project does"
```

### Option C: List Available Tools

```bash
node cli.js tools
```

## Step 4: Try Advanced Features

### Use a Different Model

```bash
node cli.js chat --model gpt-4o
```

### Load MCP Configuration

```bash
node cli.js chat --mcp-config examples/mcp-config.json
```

### Disable Tools (for pure chat)

```bash
node cli.js chat --no-tools
```

### Custom System Prompt

```bash
node cli.js chat --system "You are a helpful Python coding assistant"
```

## Step 5: Programmatic Usage

Create a file `my-agent.js`:

```javascript
const { Agent, tools } = require('./index');

async function main() {
  const agent = new Agent({
    model: 'gpt-4o-mini'
  });

  // Register tools
  Object.values(tools).forEach(tool => {
    agent.registerTool(tool);
  });

  // Chat
  const response = await agent.chat('Hello!');
  console.log(response);
}

main();
```

Run it:
```bash
node my-agent.js
```

## Common Commands Cheatsheet

| Command | Description |
|---------|-------------|
| `npm start` | Start interactive chat |
| `npm test` | Run test suite |
| `node cli.js ask "question"` | Ask single question |
| `node cli.js tools` | List available tools |
| `node cli.js mcp-example` | Create example MCP config |
| `node cli.js chat --help` | Show all options |

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out [examples/](examples/) for more usage examples
- Read [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- Create custom tools for your specific needs

## Troubleshooting

### "API key is required" error
Make sure you've created a `.env` file and added your OpenAI API key.

### npm install fails
Make sure you have Node.js >= 18.0.0 installed: `node --version`

### Command not found
Use `node cli.js` instead of `stick-gpt` or run `npm link` to install globally.

## Getting Help

- Open an issue on GitHub
- Check the [examples/](examples/) directory
- Read the full documentation in [README.md](README.md)

Happy chatting! 🤖
