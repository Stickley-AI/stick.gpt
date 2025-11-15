const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

/**
 * GPT Agent with tool calling capabilities
 */
class Agent {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      throw new Error('OpenAI API key is required. Set OPENAI_API_KEY environment variable or pass it in config.');
    }

    this.model = config.model || process.env.MODEL || 'gpt-4o-mini';
    this.temperature = parseFloat(config.temperature || process.env.TEMPERATURE || '0.7');
    this.maxTokens = parseInt(config.maxTokens || process.env.MAX_TOKENS || '2000', 10);
    
    this.client = new OpenAI({ apiKey: this.apiKey });
    this.conversationHistory = [];
    this.tools = [];
    this.systemPrompt = config.systemPrompt || 'You are a helpful AI assistant with access to various tools. Use them when appropriate to help the user.';
  }

  /**
   * Register a tool for the agent to use
   * @param {Object} tool - Tool definition with name, description, parameters, and handler
   */
  registerTool(tool) {
    if (!tool.name || !tool.description || !tool.handler) {
      throw new Error('Tool must have name, description, and handler properties');
    }

    this.tools.push(tool);
  }

  /**
   * Get tool definitions in OpenAI function calling format
   */
  getToolDefinitions() {
    return this.tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters || {
          type: 'object',
          properties: {},
          required: []
        }
      }
    }));
  }

  /**
   * Execute a tool by name with given arguments
   */
  async executeTool(toolName, args) {
    const tool = this.tools.find(t => t.name === toolName);
    if (!tool) {
      throw new Error(`Tool "${toolName}" not found`);
    }

    try {
      return await tool.handler(args);
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Send a message and get a response
   */
  async chat(userMessage) {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    let continueLoop = true;
    let finalResponse = null;

    while (continueLoop) {
      // Prepare messages with system prompt
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...this.conversationHistory
      ];

      // Make API call
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        tools: this.getToolDefinitions().length > 0 ? this.getToolDefinitions() : undefined
      });

      const assistantMessage = response.choices[0].message;

      // Check if assistant wants to call tools
      if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
        // Add assistant's tool call request to history
        this.conversationHistory.push({
          role: 'assistant',
          content: assistantMessage.content,
          tool_calls: assistantMessage.tool_calls
        });

        // Execute each tool call
        for (const toolCall of assistantMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);

          console.log(`\n[Tool Call] ${functionName}(${JSON.stringify(functionArgs)})`);

          const result = await this.executeTool(functionName, functionArgs);

          // Add tool result to history
          this.conversationHistory.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(result)
          });
        }

        // Continue loop to get final response
        continue;
      } else {
        // No tool calls, this is the final response
        this.conversationHistory.push({
          role: 'assistant',
          content: assistantMessage.content
        });

        finalResponse = assistantMessage.content;
        continueLoop = false;
      }
    }

    return finalResponse;
  }

  /**
   * Reset conversation history
   */
  resetConversation() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return [...this.conversationHistory];
  }

  /**
   * Save conversation to file
   */
  saveConversation(filePath) {
    fs.writeFileSync(filePath, JSON.stringify(this.conversationHistory, null, 2));
  }

  /**
   * Load conversation from file
   */
  loadConversation(filePath) {
    if (fs.existsSync(filePath)) {
      this.conversationHistory = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  }
}

module.exports = Agent;
