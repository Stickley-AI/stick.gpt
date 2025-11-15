# stick.gpt

A powerful local GPT agent with tool calling capabilities and MCP (Model Context Protocol) integrations.

## Features

- 🤖 **OpenAI Integration**: Use GPT-4, GPT-4-turbo, or GPT-3.5-turbo models
- 🛠️ **Tool Calling**: Built-in tools for file operations, command execution, and more
- 🔌 **MCP Support**: Load and use external tools via Model Context Protocol
- 💬 **Interactive Chat**: Conversational interface with context retention
- 🎨 **Beautiful CLI**: Color-coded output with loading indicators
- ⚙️ **Configurable**: Environment variables and command-line options

## Installation

```bash
# Clone the repository
git clone https://github.com/Stickley-AI/stick.gpt.git
cd stick.gpt

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your OpenAI API key
```

## Configuration

Create a `.env` file with your OpenAI API key:

```env
OPENAI_API_KEY=your-api-key-here
MODEL=gpt-4o-mini
TEMPERATURE=0.7
MAX_TOKENS=2000
```

## Usage

### Interactive Chat

Start an interactive chat session:

```bash
npm start
# or
node cli.js chat
```

Options:
- `-m, --model <model>`: Choose the OpenAI model (default: gpt-4o-mini)
- `-t, --temperature <temp>`: Set temperature (0.0-2.0)
- `--no-tools`: Disable built-in tools
- `--mcp-config <path>`: Load MCP configuration file or directory
- `-s, --system <prompt>`: Set custom system prompt

Example:
```bash
node cli.js chat --model gpt-4o --temperature 0.5 --system "You are a helpful coding assistant"
```

### Single Question

Ask a single question:

```bash
node cli.js ask "What is the capital of France?"
```

### List Available Tools

```bash
node cli.js tools
```

### Create MCP Example Config

```bash
node cli.js mcp-example -o my-mcp-config.json
```

## Built-in Tools

The agent comes with several built-in tools:

- **read_file**: Read file contents from the filesystem
- **write_file**: Write content to a file
- **list_directory**: List directory contents
- **execute_command**: Execute shell commands
- **get_current_time**: Get current date and time
- **web_search**: Search the web (placeholder)

## MCP Integration

MCP (Model Context Protocol) allows you to extend the agent with custom tools. Create a JSON configuration file:

```json
{
  "name": "my-tools",
  "version": "1.0.0",
  "description": "Custom tools configuration",
  "tools": [
    {
      "name": "custom_tool",
      "description": "Description of what this tool does",
      "parameters": {
        "type": "object",
        "properties": {
          "input": {
            "type": "string",
            "description": "Input parameter description"
          }
        },
        "required": ["input"]
      }
    }
  ]
}
```

Load it with:
```bash
node cli.js chat --mcp-config ./my-tools.json
```

## Examples

### Example 1: File Operations

```
You: Read the contents of package.json
Assistant: [Uses read_file tool] Here are the contents of package.json...
```

### Example 2: Command Execution

```
You: What files are in the current directory?
Assistant: [Uses execute_command tool] Here are the files in the current directory...
```

### Example 3: Multiple Tools

```
You: Create a file called hello.txt with "Hello World" and then read it back to me
Assistant: [Uses write_file and read_file tools] I've created the file with "Hello World" and confirmed its contents...
```

## Development

### Project Structure

```
stick.gpt/
├── agent.js         # Core agent implementation
├── tools.js         # Built-in tool definitions
├── mcp.js          # MCP integration
├── cli.js          # Command-line interface
├── package.json    # Node.js dependencies
├── .env.example    # Environment variable template
└── README.md       # Documentation
```

### Adding Custom Tools

You can add custom tools programmatically:

```javascript
const Agent = require('./agent');

const agent = new Agent();

agent.registerTool({
  name: 'my_custom_tool',
  description: 'Does something custom',
  parameters: {
    type: 'object',
    properties: {
      input: { type: 'string', description: 'Input parameter' }
    },
    required: ['input']
  },
  handler: async (args) => {
    // Your tool implementation
    return { success: true, result: 'Done!' };
  }
});
```

## Requirements

- Node.js >= 18.0.0
- OpenAI API key

## License

Apache-2.0 - See [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

- [ ] Full MCP server communication
- [ ] Additional built-in tools
- [ ] Conversation persistence
- [ ] Web search integration
- [ ] Multiple AI provider support
- [ ] Plugin system

## Acknowledgments

Built with OpenAI's GPT models and designed to integrate with the Model Context Protocol.