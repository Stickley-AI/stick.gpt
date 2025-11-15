#!/usr/bin/env node

/**
 * Simple test script to verify stick.gpt functionality
 */

const Agent = require('./agent');
const tools = require('./tools');
const MCPIntegration = require('./mcp');
const fs = require('fs');
const path = require('path');

console.log('🧪 Running stick.gpt tests...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.log(`✗ ${name}: ${error.message}`);
    failed++;
  }
}

// Test 1: Agent initialization
test('Agent can be initialized without API key in test mode', () => {
  try {
    // This should throw an error without API key
    const agent = new Agent();
    throw new Error('Should have thrown an error');
  } catch (error) {
    if (error.message.includes('API key is required')) {
      // Expected
    } else {
      throw error;
    }
  }
});

// Test 2: Agent initialization with API key
test('Agent can be initialized with API key', () => {
  const agent = new Agent({ apiKey: 'test-key' });
  if (!agent.client) throw new Error('Client not initialized');
  if (agent.model !== 'gpt-4o-mini') throw new Error('Default model not set');
});

// Test 3: Tool registration
test('Tools can be registered', () => {
  const agent = new Agent({ apiKey: 'test-key' });
  agent.registerTool(tools.readFile);
  if (agent.tools.length !== 1) throw new Error('Tool not registered');
});

// Test 4: Multiple tool registration
test('Multiple tools can be registered', () => {
  const agent = new Agent({ apiKey: 'test-key' });
  Object.values(tools).forEach(tool => agent.registerTool(tool));
  if (agent.tools.length !== 6) throw new Error(`Expected 6 tools, got ${agent.tools.length}`);
});

// Test 5: Tool definitions format
test('Tool definitions are in correct format', () => {
  const agent = new Agent({ apiKey: 'test-key' });
  agent.registerTool(tools.readFile);
  const defs = agent.getToolDefinitions();
  if (defs.length !== 1) throw new Error('Tool definitions not generated');
  if (defs[0].type !== 'function') throw new Error('Invalid tool definition format');
  if (!defs[0].function.name) throw new Error('Tool name missing');
});

// Test 6: Read file tool
test('Read file tool works', async () => {
  const result = await tools.readFile.handler({ path: './package.json' });
  if (!result.success) throw new Error('Read file failed');
  if (!result.content.includes('stick.gpt')) throw new Error('File content incorrect');
});

// Test 7: Get current time tool
test('Get current time tool works', async () => {
  const result = await tools.getCurrentTime.handler({});
  if (!result.success) throw new Error('Get time failed');
  if (!result.timestamp) throw new Error('Timestamp missing');
});

// Test 8: List directory tool
test('List directory tool works', async () => {
  const result = await tools.listDirectory.handler({ path: '.' });
  if (!result.success) throw new Error('List directory failed');
  if (!Array.isArray(result.contents)) throw new Error('Contents not an array');
  if (result.contents.length === 0) throw new Error('No files found');
});

// Test 9: MCP Integration initialization
test('MCP Integration can be initialized', () => {
  const mcp = new MCPIntegration();
  if (!mcp.mcpConfigs) throw new Error('MCP configs not initialized');
  if (!mcp.mcpTools) throw new Error('MCP tools not initialized');
});

// Test 10: MCP config loading
test('MCP config can be loaded', () => {
  const mcp = new MCPIntegration();
  const testConfigPath = path.join(__dirname, 'examples', 'mcp-config.json');
  if (fs.existsSync(testConfigPath)) {
    const result = mcp.loadConfig(testConfigPath);
    if (!result.success) throw new Error('Failed to load MCP config');
    if (mcp.mcpTools.length === 0) throw new Error('No MCP tools loaded');
  }
});

// Test 11: Conversation history
test('Conversation history is maintained', () => {
  const agent = new Agent({ apiKey: 'test-key' });
  const history = agent.getHistory();
  if (!Array.isArray(history)) throw new Error('History not an array');
  if (history.length !== 0) throw new Error('Initial history not empty');
});

// Test 12: Reset conversation
test('Conversation can be reset', () => {
  const agent = new Agent({ apiKey: 'test-key' });
  agent.conversationHistory = [{ role: 'user', content: 'test' }];
  agent.resetConversation();
  if (agent.getHistory().length !== 0) throw new Error('History not cleared');
});

// Summary
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests completed: ${passed + failed}`);
console.log(`✓ Passed: ${passed}`);
if (failed > 0) {
  console.log(`✗ Failed: ${failed}`);
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed!');
  process.exit(0);
}
