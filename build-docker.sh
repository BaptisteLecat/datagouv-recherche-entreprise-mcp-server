#!/bin/bash

# Build and run the MCP server with Docker
set -e

echo "🏗️  Building French Business MCP Server Docker image..."

# Build the project first
echo "📦 Building TypeScript project..."
npm run build

# Build Docker image
echo "🐳 Building Docker image..."
docker build -f Dockerfile.multistage -t french-business-mcp:latest .

echo "✅ Build completed successfully!"
echo ""
echo "To run the container:"
echo "  docker run -it --rm french-business-mcp:latest"
echo ""
echo "To run with docker-compose:"
echo "  docker-compose up"
echo ""
echo "To use in VS Code MCP configuration:"
echo '  "command": "docker",'
echo '  "args": ["run", "-i", "--rm", "french-business-mcp:latest"]'