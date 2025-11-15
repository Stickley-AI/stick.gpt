/**
 * stick.gpt - Local GPT agent with tool calling and MCP integrations
 * 
 * Main entry point for programmatic use
 */

const Agent = require('./agent');
const tools = require('./tools');
const MCPIntegration = require('./mcp');

module.exports = {
  Agent,
  tools,
  MCPIntegration
};
