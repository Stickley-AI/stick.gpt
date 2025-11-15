const { Agent, tools } = require('../index');

async function main() {
  console.log('Example: Using stick.gpt programmatically\n');

  const agent = new Agent({
    model: 'gpt-4o-mini',
    temperature: 0.7,
    systemPrompt: 'You are a helpful assistant that uses tools when needed.'
  });

  // Register built-in tools
  Object.values(tools).forEach(tool => {
    agent.registerTool(tool);
  });

  console.log(`Registered ${agent.tools.length} tools\n`);

  // Example 1: Simple question without tools
  console.log('Example 1: Simple question');
  console.log('Question: What is 2 + 2?');
  const response1 = await agent.chat('What is 2 + 2?');
  console.log('Answer:', response1, '\n');

  // Example 2: Using a tool
  console.log('Example 2: Using get_current_time tool');
  console.log('Question: What time is it?');
  const response2 = await agent.chat('What time is it?');
  console.log('Answer:', response2, '\n');

  // Example 3: File operation (safe example that doesn't actually write)
  console.log('Example 3: Asking about file operations');
  console.log('Question: Can you help me understand how to read files?');
  const response3 = await agent.chat('Can you help me understand how to read files?');
  console.log('Answer:', response3, '\n');

  console.log('✓ Examples completed successfully!');
}

// Only run if OpenAI API key is set
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-api-key-here') {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
} else {
  console.log('⚠️  To run this example, set your OPENAI_API_KEY in the .env file');
  console.log('Copy .env.example to .env and add your API key');
}
