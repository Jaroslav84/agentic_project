# AI Documentation

## Reference Links


## Recent Updates

### Rich Console Output
Integrated Rich library for beautiful console output:
- Each response block appears in its own panel with title and subtitle
- Color-coded events 
- Structured logging with icons and color formatting
- Clean, segmented display of responses

### MCP Server Integration Support
Added support for Model Context Protocol (MCP) servers through the `mcp_server_file` field in drop zone configuration. This allows integration with external tools and services. The file path is passed directly to ClaudeCodeOptions, which handles loading the configuration.


### MCP Server File Format

```json
{
  "database": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {"DATABASE_URL": "postgresql://localhost:5432/mydb"}
  }
}
```

### Implementation Notes


### Visual Output Features
The application now uses Rich console for enhanced visual feedback


