# Examples

This directory contains example files and configurations for stick.gpt.

## Example 1: Basic Usage

```bash
# Ask a simple question
node cli.js ask "What is 2 + 2?"

# Start interactive chat
node cli.js chat
```

## Example 2: Using with Custom MCP Config

Create a file `examples/custom-tools.json`:

```json
{
  "name": "custom-tools",
  "version": "1.0.0",
  "description": "Custom tool configuration",
  "tools": [
    {
      "name": "calculate",
      "description": "Perform mathematical calculations",
      "parameters": {
        "type": "object",
        "properties": {
          "expression": {
            "type": "string",
            "description": "The mathematical expression to evaluate"
          }
        },
        "required": ["expression"]
      }
    }
  ]
}
```

Then run:
```bash
node cli.js chat --mcp-config examples/custom-tools.json
```

## Example 3: Programmatic Usage

```javascript
const { Agent, tools } = require('../index');

async function main() {
  const agent = new Agent({
    model: 'gpt-4o-mini',
    temperature: 0.7
  });

  // Register built-in tools
  Object.values(tools).forEach(tool => {
    agent.registerTool(tool);
  });

  // Have a conversation
  const response = await agent.chat('What files are in the current directory?');
  console.log(response);
}

main().catch(console.error);
```

## Example 4: Custom Tool Development

```javascript
const { Agent } = require('../index');

const agent = new Agent();

// Add a custom weather tool (placeholder)
agent.registerTool({
  name: 'get_weather',
  description: 'Get weather information for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The city name or coordinates'
      }
    },
    required: ['location']
  },
  handler: async (args) => {
    // In a real implementation, this would call a weather API
    return {
      success: true,
      weather: `Weather for ${args.location}: Sunny, 72°F`,
      note: 'This is a placeholder. Integrate with a real weather API.'
    };
  }
});

// Use the custom tool
agent.chat('What is the weather in San Francisco?')
  .then(response => console.log(response))
  .catch(console.error);
```

## Example 5: Docker Deployment

See [kubernetes/README.md](kubernetes/README.md) for Kubernetes deployment examples.

### Quick Docker Run

```bash
# Pull the image from GitHub Container Registry
docker pull ghcr.io/stickley-ai/stick.gpt:latest

# Run with environment variables
docker run -it --rm \
  -e OPENAI_API_KEY="your-api-key" \
  ghcr.io/stickley-ai/stick.gpt:latest chat

# Using docker-compose
docker-compose run stick-gpt
```

For complete deployment instructions, see [DEPLOYMENT.md](../DEPLOYMENT.md) in the repository root.
