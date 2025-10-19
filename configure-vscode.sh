#!/bin/bash

# Helper script to configure VS Code MCP with the French Business Search server
set -e

VSCODE_MCP_CONFIG="$HOME/Library/Application Support/Code/User/mcp.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🔧 VS Code MCP Configuration Helper"
echo "====================================="
echo ""

# Check if VS Code MCP config exists
if [ ! -f "$VSCODE_MCP_CONFIG" ]; then
    echo "📁 Creating VS Code MCP configuration directory..."
    mkdir -p "$(dirname "$VSCODE_MCP_CONFIG")"
    echo "{}" > "$VSCODE_MCP_CONFIG"
fi

echo "Current MCP configuration location: $VSCODE_MCP_CONFIG"
echo ""

# Check Docker availability
if command -v docker &> /dev/null; then
    if docker info &> /dev/null; then
        echo "✅ Docker is available and running"
        DOCKER_AVAILABLE=true
    else
        echo "⚠️  Docker is installed but not running"
        DOCKER_AVAILABLE=false
    fi
else
    echo "❌ Docker is not installed"
    DOCKER_AVAILABLE=false
fi

echo ""

# Build Docker image if Docker is available
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🐳 Building Docker image..."
    cd "$SCRIPT_DIR"
    npm run build
    docker build -f Dockerfile.multistage -t french-business-mcp:latest .
    echo "✅ Docker image built successfully"
    echo ""
fi

# Show configuration options
echo "📋 Available configuration options:"
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "1. Docker (Recommended):"
    echo '   "command": "docker",'
    echo '   "args": ["run", "-i", "--rm", "french-business-mcp:latest"]'
    echo ""
fi

echo "2. Local Node.js:"
echo "   \"command\": \"node\","
echo "   \"args\": [\"$SCRIPT_DIR/dist/index.js\"]"
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "3. Docker Compose:"
    echo '   "command": "docker-compose",'
    echo "   \"args\": [\"-f\", \"$SCRIPT_DIR/docker-compose.yml\", \"run\", \"--rm\", \"french-business-mcp\"]"
    echo ""
fi

echo "📖 Example configuration file: $SCRIPT_DIR/vscode-mcp-config.example.json"
echo ""
echo "🔗 Next steps:"
echo "1. Copy the desired configuration to: $VSCODE_MCP_CONFIG"
echo "2. Update paths in the configuration if needed"
echo "3. Restart VS Code"
echo "4. Test the MCP server in VS Code chat"
echo ""
echo "💡 For more information, see the README.md file"