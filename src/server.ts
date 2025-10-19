import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { ApiClient } from './api-client.js';
import { tools } from './tools.js';
import type { SearchBusinessesParams, SearchNearbyParams } from './types.js';

/**
 * MCP Server for French Government's API Recherche d'Entreprises
 */
export class RechercheEntrepriseServer {
  private server: Server;
  private apiClient: ApiClient;

  constructor() {
    this.server = new Server(
      {
        name: 'datagouv-recherche-entreprise',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.apiClient = new ApiClient();
    this.setupHandlers();
  }

  private setupHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: tools,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'search_businesses':
            return await this.handleSearchBusinesses(args as SearchBusinessesParams);
          
          case 'search_businesses_nearby':
            return await this.handleSearchNearby(args as SearchNearbyParams);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing tool ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  private async handleSearchBusinesses(params: SearchBusinessesParams) {
    try {
      const response = await this.apiClient.searchBusinesses(params);
      
      return {
        content: [
          {
            type: 'text',
            text: this.formatSearchResponse(response, 'text search'),
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Business search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private async handleSearchNearby(params: SearchNearbyParams) {
    try {
      const response = await this.apiClient.searchNearby(params);
      
      return {
        content: [
          {
            type: 'text',
            text: this.formatSearchResponse(response, 'geographic search'),
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Geographic search failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private formatSearchResponse(response: any, searchType: string): string {
    const { results, total_results, page, per_page, total_pages } = response;

    let output = `# French Business Search Results (${searchType})\n\n`;
    output += `**Search Summary:**\n`;
    output += `- Total results: ${total_results.toLocaleString()}\n`;
    output += `- Page: ${page} of ${total_pages}\n`;
    output += `- Results per page: ${per_page}\n`;
    output += `- Showing: ${results.length} businesses\n\n`;

    if (results.length === 0) {
      output += `No businesses found matching the search criteria.\n`;
      return output;
    }

    results.forEach((business: any, index: number) => {
      output += `## ${index + 1}. ${business.nom_complet}\n\n`;
      
      // Basic information
      output += `**Basic Information:**\n`;
      output += `- SIREN: ${business.siren}\n`;
      output += `- Legal name: ${business.nom_raison_sociale || 'N/A'}\n`;
      output += `- Sigle: ${business.sigle || 'N/A'}\n`;
      output += `- Administrative status: ${business.etat_administratif === 'A' ? 'Active' : 'Ceased'}\n`;
      output += `- Creation date: ${business.date_creation || 'N/A'}\n`;
      output += `- Legal nature: ${business.nature_juridique}\n`;
      output += `- Main activity: ${business.activite_principale}\n`;
      output += `- Activity section: ${business.section_activite_principale}\n`;
      
      // Business size
      if (business.categorie_entreprise) {
        const categoryLabels = {
          'PME': 'Small/Medium Enterprise (< 250 employees)',
          'ETI': 'Intermediate Enterprise (250-5000 employees)', 
          'GE': 'Large Enterprise (> 5000 employees)'
        };
        output += `- Company category: ${categoryLabels[business.categorie_entreprise as keyof typeof categoryLabels] || business.categorie_entreprise}\n`;
      }
      
      if (business.tranche_effectif_salarie) {
        output += `- Employee range: ${business.tranche_effectif_salarie}\n`;
      }
      
      // Establishments
      output += `- Number of establishments: ${business.nombre_etablissements}\n`;
      output += `- Open establishments: ${business.nombre_etablissements_ouverts}\n\n`;

      // Headquarters information
      if (business.siege) {
        output += `**Headquarters:**\n`;
        output += `- SIRET: ${business.siege.siret}\n`;
        output += `- Address: ${business.siege.adresse}\n`;
        if (business.siege.latitude && business.siege.longitude) {
          output += `- Coordinates: ${business.siege.latitude}, ${business.siege.longitude}\n`;
        }
        output += `- Activity: ${business.siege.activite_principale}\n`;
        output += `- Status: ${business.siege.etat_administratif === 'A' ? 'Active' : 'Closed'}\n\n`;
      }

      // Financial information
      if (business.finances && Object.keys(business.finances).length > 0) {
        output += `**Financial Data:**\n`;
        Object.entries(business.finances).forEach(([year, data]: [string, any]) => {
          if (data.ca !== undefined) {
            output += `- ${year} Revenue: €${data.ca.toLocaleString()}\n`;
          }
          if (data.resultat_net !== undefined) {
            output += `- ${year} Net Result: €${data.resultat_net.toLocaleString()}\n`;
          }
        });
        output += `\n`;
      }

      // Certifications and labels
      if (business.complements) {
        const labels = [];
        if (business.complements.est_association) labels.push('Association');
        if (business.complements.est_bio) labels.push('Organic certified');
        if (business.complements.est_rge) labels.push('RGE certified');
        if (business.complements.est_qualiopi) labels.push('Qualiopi certified');
        if (business.complements.est_ess) labels.push('Social & Solidarity Economy');
        if (business.complements.est_service_public) labels.push('Public service');
        if (business.complements.est_patrimoine_vivant) labels.push('Living Heritage');
        
        if (labels.length > 0) {
          output += `**Certifications & Labels:** ${labels.join(', ')}\n\n`;
        }
      }

      // Directors (limited to first 3 for brevity)
      if (business.dirigeants && business.dirigeants.length > 0) {
        output += `**Directors:**\n`;
        business.dirigeants.slice(0, 3).forEach((dirigeant: any) => {
          if (dirigeant.type_dirigeant === 'personne physique') {
            output += `- ${dirigeant.prenoms} ${dirigeant.nom} (${dirigeant.qualite})\n`;
          } else {
            output += `- ${dirigeant.denomination} (${dirigeant.qualite})\n`;
          }
        });
        if (business.dirigeants.length > 3) {
          output += `- ... and ${business.dirigeants.length - 3} more\n`;
        }
        output += `\n`;
      }

      // Related establishments (limited to first 3)
      if (business.matching_etablissements && business.matching_etablissements.length > 0) {
        output += `**Related Establishments (${business.matching_etablissements.length} total):**\n`;
        business.matching_etablissements.slice(0, 3).forEach((etab: any, idx: number) => {
          output += `${idx + 1}. SIRET: ${etab.siret}\n`;
          output += `   Address: ${etab.adresse}\n`;
          output += `   Activity: ${etab.activite_principale}\n`;
          output += `   Status: ${etab.etat_administratif === 'A' ? 'Active' : 'Closed'}\n`;
        });
        if (business.matching_etablissements.length > 3) {
          output += `... and ${business.matching_etablissements.length - 3} more establishments\n`;
        }
        output += `\n`;
      }

      output += `---\n\n`;
    });

    // Pagination information
    if (total_pages > 1) {
      output += `**Pagination:** Use "page" parameter to access additional results (page ${page} of ${total_pages})\n\n`;
    }

    output += `*Data source: API Recherche d'Entreprises - French Government*\n`;
    output += `*Rate limit: 7 requests per second - search responsibly*`;

    return output;
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('French Business Search MCP server running on stdio');
  }
}