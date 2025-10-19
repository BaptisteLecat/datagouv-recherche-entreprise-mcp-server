# MCP Server Implementation Plan - API Recherche d'Entreprises

## Project Overview

This document outlines the complete implementation plan for creating a Model Context Protocol (MCP) server for the French Government's "Recherche d'Entreprises" API. The MCP server will provide AI agents with standardized access to search for French businesses, associations, and public services.

## API Analysis

### Base Information
- **API Base URL**: `https://recherche-entreprises.api.gouv.fr`
- **Rate Limit**: 7 requests per second
- **Access**: Open (no authentication required)
- **Data Sources**: SIRENE database, INPI, INSEE, various ministries

### Available Endpoints
1. **Text Search** (`/search`) - Search by name, address, directors, elected officials
2. **Geographic Search** (`/near_point`) - Search by coordinates and radius

### Key Data Returned
- Business identification (SIREN, SIRET, NAF codes)
- Business details (name, legal status, activity sector)
- Address and geographic information
- Directors and elected officials
- Financial data (turnover, net result)
- Certifications and labels (RGE, Bio, etc.)
- Establishment details

## Implementation Architecture

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **MCP Framework**: @modelcontextprotocol/sdk
- **HTTP Client**: Built-in fetch API
- **Rate Limiting**: Simple token bucket implementation
- **Build System**: TypeScript compiler with npm scripts

### Project Structure
```
src/
├── types.ts                 # All TypeScript interfaces
├── api-client.ts           # HTTP client with rate limiting
├── tools.ts                # MCP tools implementation
├── server.ts               # Main MCP server setup
└── index.ts                # Entry point
```

## Simplified Implementation Plan

### Phase 1: Basic Setup (Priority: High)
**Estimated Time**: 1-2 hours

- [ ] Initialize npm project with TypeScript
- [ ] Install @modelcontextprotocol/sdk and @types/node
- [ ] Create basic file structure (5 files total)
- [ ] Set up TypeScript configuration

### Phase 2: Core Implementation (Priority: High)
**Estimated Time**: 3-4 hours

- [ ] Create API response TypeScript interfaces
- [ ] Implement HTTP client with simple rate limiting (7 req/sec)
- [ ] Build the two MCP tools with parameter validation
- [ ] Set up basic MCP server

### Phase 3: Basic Polish (Priority: Medium)
**Estimated Time**: 1-2 hours

- [ ] Add basic error handling
- [ ] Format responses for AI consumption
- [ ] Add simple logging
- [ ] Create README with usage instructions

## MCP Tools (Detailed Specifications)

### Tool 1: `search_businesses`
**Purpose**: Search businesses by text query with comprehensive filtering options

**Parameters**:
- `q` (string, required): Search terms for name, address, directors, elected officials
- `activite_principale` (string, optional): NAF/APE activity codes (comma-separated)
- `categorie_entreprise` (enum, optional): Business category (PME, ETI, GE)
- `code_postal` (string, optional): Postal codes (comma-separated)
- `departement` (string, optional): Department codes (pattern validation)
- `region` (string, optional): Region codes
- `etat_administratif` (enum, optional): Administrative status (A=Active, C=Ceased)
- `nature_juridique` (string, optional): Legal nature codes
- `tranche_effectif_salarie` (string, optional): Employee count ranges
- `est_association` (boolean, optional): Filter for associations only
- `est_service_public` (boolean, optional): Filter for public services only
- Financial filters: `ca_min`, `ca_max`, `resultat_net_min`, `resultat_net_max`
- Certification filters: `est_bio`, `est_rge`, `est_qualiopi`, etc.
- Pagination: `page`, `per_page` (max 25)
- Response optimization: `minimal`, `include`

### Tool 2: `search_businesses_nearby`
**Purpose**: Find businesses near specific coordinates

**Parameters**:
- `lat` (number, required): Latitude (-90 to 90)
- `long` (number, required): Longitude (-180 to 180)
- `radius` (number, optional): Search radius in km (max 50, default 5)
- `activite_principale` (string, optional): Activity codes filter
- `section_activite_principale` (string, optional): Activity sections (A-U)
- Pagination and response options same as text search

## Key Implementation Notes

### Rate Limiting Implementation
```typescript
class SimpleRateLimiter {
  private lastRequest = 0;
  private readonly minInterval = 1000 / 7; // 7 requests per second
  
  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequest;
    if (elapsed < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - elapsed));
    }
    this.lastRequest = Date.now();
  }
}
```

### Dependencies
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0"
  }
}
```

## Timeline Summary

- **Phase 1 (Setup)**: 1-2 hours
- **Phase 2 (Core Implementation)**: 3-4 hours  
- **Phase 3 (Basic Polish)**: 1-2 hours

**Total Estimated Time**: 5-8 hours

## Next Steps

1. **Initialize Project**: Set up the basic TypeScript project structure
2. **Implement Core Features**: Build the API client, rate limiter, and MCP tools
3. **Test with Real API**: Verify functionality with actual API calls
4. **Create README**: Basic usage documentation

This simplified plan focuses on getting a working MCP server quickly while maintaining the comprehensive tool descriptions and rate limiting functionality you requested.