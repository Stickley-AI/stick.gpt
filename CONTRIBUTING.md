# Contributing to stick.gpt

Thank you for your interest in contributing to stick.gpt! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/stick.gpt.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`
5. Make your changes
6. Run tests: `npm test`
7. Commit your changes: `git commit -m "Description of changes"`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Open a Pull Request

## Development Guidelines

### Code Style

- Use consistent indentation (2 spaces)
- Follow existing code patterns
- Add comments for complex logic
- Keep functions small and focused

### Testing

- All new features should include tests
- Run `npm test` before submitting
- Ensure all tests pass

### Documentation

- Update README.md for new features
- Add JSDoc comments for new functions
- Include examples where appropriate

## Types of Contributions

### Bug Reports

When reporting bugs, please include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (Node.js version, OS, etc.)

### Feature Requests

For new features, please:
- Describe the feature
- Explain the use case
- Provide examples if possible

### Code Contributions

We welcome:
- Bug fixes
- New tools
- Performance improvements
- Documentation improvements
- Test coverage improvements

### Adding New Tools

To add a new built-in tool:

1. Add the tool definition to `tools.js`:

```javascript
newTool: {
  name: 'tool_name',
  description: 'What the tool does',
  parameters: {
    type: 'object',
    properties: {
      param: {
        type: 'string',
        description: 'Parameter description'
      }
    },
    required: ['param']
  },
  handler: async (args) => {
    // Implementation
    return { success: true, result: 'value' };
  }
}
```

2. Add tests for the new tool in `test.js`
3. Update documentation in README.md

### MCP Integration Improvements

To improve MCP support:

1. Enhance `mcp.js` with better server communication
2. Add support for more MCP features
3. Create example MCP configurations

## Commit Messages

Use clear, descriptive commit messages:

- `feat: Add new tool for X`
- `fix: Resolve issue with Y`
- `docs: Update README with Z`
- `test: Add tests for W`
- `refactor: Improve V implementation`

## Code Review Process

1. Submit a Pull Request
2. Address any feedback
3. Maintainers will review and merge

## Questions?

Feel free to open an issue for questions or discussions.

## License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License.
