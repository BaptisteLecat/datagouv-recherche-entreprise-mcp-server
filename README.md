# API Recherche d'Entreprises - MCP Server

A Model Context Protocol (MCP) server providing AI agents with standardized access to the French Government's "Recherche d'Entreprises" API. This server enables comprehensive searches for French businesses, associations, and public services.

## Features

### 🔍 **Two Comprehensive Search Tools**

1. **`search_businesses`** - Text-based business search
   - Search by company name, address, directors, elected officials
   - Filter by business activity (NAF/APE codes), legal status, size
   - Geographic filtering (postal codes, departments, regions)
   - Certification and label filtering (Bio, RGE, Qualiopi, ESS, etc.)
   - Financial data filtering (revenue, net result)
   - Person search (directors and elected officials)

2. **`search_businesses_nearby`** - Geographic proximity search
   - Find businesses near specific coordinates
   - Configurable search radius (up to 50km)
   - Activity and section filtering
   - Same rich data as text search

### 📊 **Rich Business Data**

Each search returns comprehensive information including:
- **Basic Information**: SIREN, legal name, administrative status, creation date
- **Business Classification**: Activity codes, legal nature, company size
- **Geographic Data**: Headquarters address, coordinates, all establishments
- **Financial Information**: Revenue, net result (when available)
- **Certifications & Labels**: Bio, RGE, Qualiopi, ESS, Living Heritage, etc.
- **Leadership**: Directors and elected officials
- **Establishments**: Complete list of business locations

### 🚀 **AI-Optimized Features**

- **Comprehensive Parameter Validation**: Detailed error messages for invalid inputs
- **Rich Type Definitions**: Extensive enum values and parameter descriptions
- **Formatted Responses**: Human-readable markdown output with structured data
- **Rate Limiting**: Built-in 7 req/sec compliance with French government API
- **Pagination Support**: Handle large result sets efficiently
- **Error Handling**: Graceful handling of API errors and edge cases

## Installation

### Prerequisites

- Node.js 18.0.0 or higher (for local development)
- Docker and Docker Compose (for containerized deployment)
  - **macOS**: Install [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
  - **Windows**: Install [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
  - **Linux**: Install [Docker Engine](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/)
- npm or yarn package manager

**Important**: Make sure Docker is running before using Docker-based installation methods.

### Method 1: Docker Installation (Recommended)

Docker provides a consistent, isolated environment for running the MCP server.

1. **Clone the project**:
```bash
git clone <repository-url>
cd datagouv-recherche-entreprise-mcp-server
```

2. **Build and run with Docker**:
```bash
# Build the Docker image
npm run docker:build

# Or use the script directly
./build-docker.sh
```

3. **Run the container**:
```bash
# Run with Docker
npm run docker:run

# Or with Docker Compose
npm run docker:compose
```

### Method 2: Local Installation

For local development and testing:

1. **Clone the project**:
```bash
git clone <repository-url>
cd datagouv-recherche-entreprise-mcp-server
```

2. **Install dependencies**:
```bash
npm install
```

3. **Build the project**:
```bash
npm run build
```

## VS Code Configuration

### Using Docker with VS Code (Recommended)

Configure your MCP client to use the Dockerized server:

**For VS Code MCP** (`~/Library/Application Support/Code/User/mcp.json` on macOS):
```json
{
  "mcpServers": {
    "french-business-search": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "french-business-mcp:latest"
      ],
      "description": "Search French businesses via government API (Docker)"
    }
  }
}
```

**Alternative with Docker Compose**:
```json
{
  "mcpServers": {
    "french-business-search": {
      "command": "docker-compose",
      "args": [
        "-f",
        "/path/to/datagouv-recherche-entreprise-mcp-server/docker-compose.yml",
        "run",
        "--rm",
        "french-business-mcp"
      ],
      "description": "Search French businesses via government API (Docker Compose)"
    }
  }
}
```

### Using Local Installation with VS Code

**For local Node.js execution**:
```json
{
  "mcpServers": {
    "french-business-search": {
      "command": "node",
      "args": [
        "/path/to/datagouv-recherche-entreprise-mcp-server/dist/index.js"
      ],
      "description": "Search French businesses via government API (Local)"
    }
  }
}
```

### VS Code Setup Steps

1. **Build the Docker image** (if using Docker method):
```bash
cd /path/to/datagouv-recherche-entreprise-mcp-server
npm run docker:build
```

2. **Open VS Code Settings**:
   - Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
   - Type "MCP: Open User MCP Configuration" and select it
   - Or manually edit `~/Library/Application Support/Code/User/mcp.json`

3. **Add the configuration** from the examples above

4. **Restart VS Code** to load the new MCP server

5. **Verify installation**:
   - Open VS Code chat
   - Type a message to confirm the French business search tools are available
   - Try a test search: "Search for 'la poste' in French businesses"

### Docker Benefits for VS Code

- **Isolation**: No conflicts with local Node.js versions
- **Consistency**: Same environment across different machines
- **Easy updates**: Pull new image versions without local setup
- **Clean removal**: Remove container when not needed

## Usage Examples

### Basic Text Search

Search for a specific company:
```javascript
// Tool: search_businesses
{
  "q": "la poste"
}
```

Search for restaurants in Paris:
```javascript
{
  "q": "restaurant",
  "code_postal": "75001,75002,75003"
}
```

### Activity-Based Search

Find software companies:
```javascript
{
  "activite_principale": "62.01Z,62.02A", // Computer programming activities
  "categorie_entreprise": "PME"           // Small/Medium enterprises
}
```

Find all companies in IT sector:
```javascript
{
  "section_activite_principale": "J"  // Information and communication
}
```

### Geographic Search

Find businesses near specific coordinates:
```javascript
// Tool: search_businesses_nearby
{
  "lat": 48.8566,     // Paris center latitude
  "long": 2.3522,     // Paris center longitude  
  "radius": 5,        // 5km radius
  "section_activite_principale": "F"  // Construction companies
}
```

### Certification Filtering

Find organic certified businesses:
```javascript
{
  "est_bio": true,
  "departement": "13"  // Bouches-du-Rhône
}
```

Find businesses with environmental certification:
```javascript
{
  "est_rge": true,            // Environmental guarantor certified
  "tranche_effectif_salarie": "11,12,21"  // 10-99 employees
}
```

### Person Search

Find businesses by director name:
```javascript
{
  "nom_personne": "Dupont",
  "prenoms_personne": "Jean",
  "type_personne": "dirigeant"
}
```

### Financial Filtering

Find large profitable companies:
```javascript
{
  "ca_min": 10000000,         // Minimum €10M revenue
  "resultat_net_min": 500000, // Minimum €500K profit
  "categorie_entreprise": "GE" // Large enterprises
}
```

### Advanced Filtering

Complex search with multiple criteria:
```javascript
{
  "q": "formation",
  "est_organisme_formation": true,
  "est_qualiopi": true,
  "region": "11",              // Île-de-France
  "etat_administratif": "A",   // Active only
  "per_page": 25,
  "include": "complements,finances"
}
```

## Parameter Reference

### Search Parameters

#### Text Search (`q`)
- Natural language queries
- Company names, addresses, person names
- Examples: `"la poste"`, `"restaurant"`, `"jean dupont"`

#### Activity Classification
- **`activite_principale`**: NAF/APE codes (`"62.01Z,28.15Z"`)
- **`section_activite_principale`**: Activity sections A-U (`"J,M"`)
- **`nature_juridique`**: Legal nature codes (`"5510,5499"`)

#### Geographic Filters
- **`code_postal`**: Postal codes (`"75001,75002"`)
- **`departement`**: Department codes (`"75,13,69"`)
- **`region`**: Region codes (`"11,84"`)
- **`commune`**: INSEE commune codes

#### Business Size & Status
- **`categorie_entreprise`**: `"PME"` | `"ETI"` | `"GE"`
- **`tranche_effectif_salarie`**: Employee range codes
- **`etat_administratif`**: `"A"` (Active) | `"C"` (Ceased)

#### Certification Filters (Boolean)
- **`est_bio`**: Organic certified
- **`est_rge`**: Environmental guarantor
- **`est_qualiopi`**: Training quality certified
- **`est_association`**: Associations only
- **`est_ess`**: Social & solidarity economy
- **`est_service_public`**: Public services

#### Financial Filters
- **`ca_min`** / **`ca_max`**: Revenue range (euros)
- **`resultat_net_min`** / **`resultat_net_max`**: Net result range

#### Person Search
- **`nom_personne`**: Last name
- **`prenoms_personne`**: First name(s)
- **`type_personne`**: `"dirigeant"` | `"elu"`
- **`date_naissance_personne_min/max`**: Birth date range (YYYY-MM-DD)

#### Response Control
- **`minimal`**: Return minimal response (boolean)
- **`include`**: Include specific fields when minimal=true
- **`per_page`**: Results per page (1-25)
- **`page`**: Page number
- **`limite_matching_etablissements`**: Number of establishments (1-100)

## Response Format

The server returns structured markdown with:

```markdown
# French Business Search Results

**Search Summary:**
- Total results: 1,234
- Page: 1 of 25
- Results per page: 10
- Showing: 10 businesses

## 1. COMPANY NAME

**Basic Information:**
- SIREN: 356000000
- Legal name: LA POSTE
- Administrative status: Active
- Creation date: 1991-01-01
- Legal nature: 5510
- Main activity: 53.10Z

**Headquarters:**
- SIRET: 35600000000048
- Address: 9 RUE DU COLONEL PIERRE AVIA 75015 PARIS 15
- Coordinates: 48.83002, 2.275688

**Financial Data:**
- 2021 Revenue: €26,617,000,000
- 2021 Net Result: €2,597,000,000

**Certifications & Labels:** Public service

**Directors:**
- John DUPONT (Directeur général)

**Related Establishments (12,734 total):**
1. SIRET: 35600000000048
   Address: 9 RUE DU COLONEL PIERRE AVIA 75015 PARIS 15
   Activity: 53.10Z
   Status: Active
```

## Data Sources

This server accesses the official French government API which aggregates data from:

- **SIRENE database** (INSEE) - Business registry
- **INPI** - Directors and legal information  
- **Various ministries** - Certifications and labels
- **Agence Bio** - Organic certifications
- **ADEME** - Environmental certifications
- **Ministry of Labor** - Training certifications

## Rate Limiting

The server automatically enforces the API's rate limit of 7 requests per second. No additional configuration is needed.

## Error Handling

The server provides detailed error messages for:
- Invalid parameter values
- Missing required parameters
- API rate limiting
- Network connectivity issues
- Malformed requests

## Development

### Local Development

```bash
npm run dev
```

### Docker Development

```bash
# Build and run with Docker Compose
npm run docker:compose:build

# Run existing image
npm run docker:run

# Build new image
npm run docker:build
```

### Building

```bash
# Local build
npm run build

# Docker build
npm run docker:build
```

### Available Docker Commands

- `npm run docker:build` - Build the Docker image
- `npm run docker:run` - Run the container interactively
- `npm run docker:compose` - Start with Docker Compose
- `npm run docker:compose:build` - Build and start with Docker Compose

### Testing Docker Setup

```bash
# Test the Docker image
docker run -it --rm french-business-mcp:latest

# Test with sample input (in another terminal)
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | docker run -i --rm french-business-mcp:latest
```

### Troubleshooting Docker

**Common Issues:**

1. **Port conflicts**: The container uses stdio, not network ports
2. **Image not found**: Run `npm run docker:build` first
3. **Permission issues**: Ensure Docker is running and you have permissions

**Debugging:**

```bash
# Check if image exists
docker images | grep french-business-mcp

# Run with debugging
docker run -it --rm french-business-mcp:latest sh

# View logs
docker-compose logs french-business-mcp
```

## Architecture

```
src/
├── types.ts        # TypeScript interfaces
├── api-client.ts   # HTTP client with rate limiting
├── tools.ts        # MCP tool definitions
├── server.ts       # MCP server implementation
└── index.ts        # Entry point
```

## License

MIT License - See LICENSE file for details.

## Support

For issues related to:
- **This MCP server**: Open an issue in this repository
- **The French API**: Contact the [official API support](https://annuaire-entreprises.data.gouv.fr/faq/parcours?question=contact)
- **MCP protocol**: See [MCP documentation](https://modelcontextprotocol.io/docs)

---

**Note**: This is an unofficial implementation. Always verify critical business information through official channels.