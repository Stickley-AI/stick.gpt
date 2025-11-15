const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

/**
 * Built-in tools for the agent
 */

const tools = {
  /**
   * Read file content
   */
  readFile: {
    name: 'read_file',
    description: 'Read the contents of a file from the filesystem',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to the file to read'
        }
      },
      required: ['path']
    },
    handler: async (args) => {
      try {
        const content = fs.readFileSync(args.path, 'utf-8');
        return { success: true, content };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  /**
   * Write file content
   */
  writeFile: {
    name: 'write_file',
    description: 'Write content to a file on the filesystem',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to the file to write'
        },
        content: {
          type: 'string',
          description: 'The content to write to the file'
        }
      },
      required: ['path', 'content']
    },
    handler: async (args) => {
      try {
        fs.writeFileSync(args.path, args.content, 'utf-8');
        return { success: true, message: `File written to ${args.path}` };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  /**
   * List directory contents
   */
  listDirectory: {
    name: 'list_directory',
    description: 'List the contents of a directory',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'The path to the directory to list'
        }
      },
      required: ['path']
    },
    handler: async (args) => {
      try {
        const files = fs.readdirSync(args.path);
        const details = files.map(file => {
          const filePath = path.join(args.path, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            type: stats.isDirectory() ? 'directory' : 'file',
            size: stats.size,
            modified: stats.mtime
          };
        });
        return { success: true, contents: details };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  /**
   * Execute shell command
   */
  executeCommand: {
    name: 'execute_command',
    description: 'Execute a shell command and return the output',
    parameters: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'The shell command to execute'
        }
      },
      required: ['command']
    },
    handler: async (args) => {
      try {
        const { stdout, stderr } = await execPromise(args.command);
        return { 
          success: true, 
          stdout: stdout.trim(), 
          stderr: stderr.trim() 
        };
      } catch (error) {
        return { 
          success: false, 
          error: error.message,
          stdout: error.stdout?.trim(),
          stderr: error.stderr?.trim()
        };
      }
    }
  },

  /**
   * Get current date and time
   */
  getCurrentTime: {
    name: 'get_current_time',
    description: 'Get the current date and time',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    },
    handler: async () => {
      const now = new Date();
      return {
        success: true,
        timestamp: now.toISOString(),
        formatted: now.toLocaleString()
      };
    }
  },

  /**
   * Web search (placeholder - would need API integration)
   */
  webSearch: {
    name: 'web_search',
    description: 'Search the web for information (placeholder)',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The search query'
        }
      },
      required: ['query']
    },
    handler: async (args) => {
      return {
        success: false,
        message: 'Web search is not yet implemented. This would require an external search API.'
      };
    }
  }
};

module.exports = tools;
