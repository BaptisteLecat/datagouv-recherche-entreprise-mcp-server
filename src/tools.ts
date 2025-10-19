/**
 * MCP Tools for the API Recherche d'Entreprises
 * These tools provide comprehensive parameter validation and proper type definitions
 * to help AI agents understand exactly how to use the French business search API
 */

// Tool interface for MCP compatibility
interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
    additionalProperties: boolean;
  };
}

export const searchBusinessesTool: Tool = {
  name: 'search_businesses',
  description: `Search for French businesses, associations, and public services using text-based criteria. This comprehensive search tool allows filtering by business name, address, directors, elected officials, activity codes, certifications, and many other criteria.

**Key Features:**
- Search by business name, address, or person names
- Filter by business activity (NAF/APE codes)
- Geographic filtering (postal codes, departments, regions)
- Filter by business size, legal status, certifications
- Financial data filtering (revenue, net result)
- Support for associations, individual entrepreneurs, public services

**Usage Examples:**
- Search by name: {"q": "la poste"}
- Search by activity: {"activite_principale": "62.01Z"}  
- Search in Paris: {"code_postal": "75001,75002"}
- Search associations: {"est_association": true}
- Search bio-certified businesses: {"est_bio": true}`,
  inputSchema: {
    type: 'object',
    properties: {
      // Text search parameter
      q: {
        type: 'string',
        description: 'Search terms for business name, address, directors, or elected officials. Use natural language queries like company names or person names.'
      },
      
      // Business activity classification
      activite_principale: {
        type: 'string',
        description: 'NAF/APE activity codes (INSEE classification). Accepts single code like "62.01Z" or comma-separated list like "01.12Z,28.15Z". See INSEE documentation for complete list.'
      },
      section_activite_principale: {
        type: 'string',
        description: 'Activity section codes (A-U). Values: A (Agriculture), B (Mining), C (Manufacturing), D (Energy), E (Water/Waste), F (Construction), G (Trade), H (Transport), I (Hospitality), J (IT/Communication), K (Finance), L (Real Estate), M (Professional), N (Administrative), O (Public Admin), P (Education), Q (Health), R (Arts), S (Other Services), T (Households), U (Extraterritorial). Can use comma-separated list.',
        pattern: '^[A-U](,[A-U])*$'
      },
      categorie_entreprise: {
        type: 'string',
        enum: ['PME', 'ETI', 'GE'],
        description: 'Company size category. PME: Small/Medium Enterprise (< 250 employees), ETI: Intermediate Enterprise (250-5000 employees), GE: Large Enterprise (> 5000 employees)'
      },
      nature_juridique: {
        type: 'string',
        description: 'Legal nature codes (INSEE classification). Examples: "5510" for SA, "5499" for SAS. Accepts comma-separated list for multiple legal forms.'
      },
      tranche_effectif_salarie: {
        type: 'string',
        description: 'Employee count ranges using INSEE codes. Examples: "00" (0 employees), "01" (1-2), "02" (3-5), "03" (6-9), "11" (10-19), "12" (20-49), "21" (50-99), "22" (100-199), "31" (200-249), "32" (250-499), "41" (500-999), "42" (1000-1999), "51" (2000-4999), "52" (5000-9999), "53" (10000+), "NN" (unknown). Comma-separated for multiple ranges.'
      },
      
      // Geographic filters
      code_postal: {
        type: 'string',
        description: 'French postal codes (5 digits). Single code like "75001" or comma-separated list like "75001,75002". Filters on establishments.'
      },
      code_commune: {
        type: 'string',
        description: 'INSEE commune codes (5 characters). Single code like "75101" or comma-separated list. More precise than postal codes.'
      },
      departement: {
        type: 'string',
        description: 'French department codes (2-3 digits). Examples: "75" (Paris), "13" (Bouches-du-Rhône), "2A" (Corse-du-Sud), "971" (Guadeloupe). Comma-separated list accepted.',
        pattern: '\\b([013-8]\\d?|2[aAbB1-9]?|9[0-59]?|97[12346])\\b'
      },
      region: {
        type: 'string',
        description: 'French region codes (2 digits). Examples: "11" (Île-de-France), "84" (Auvergne-Rhône-Alpes). Comma-separated list accepted.'
      },
      epci: {
        type: 'string',
        description: 'EPCI (intercommunal cooperation) SIREN numbers. Examples: "200058519", "248100737". Comma-separated list accepted.'
      },
      code_collectivite_territoriale: {
        type: 'string',
        description: 'Territorial collectivity codes. Format: Commune (INSEE code), EPCI (SIREN), Department (INSEE+"D"), Region (INSEE). Example: "75C" for Paris commune.'
      },
      
      // Administrative status
      etat_administratif: {
        type: 'string',
        enum: ['A', 'C'],
        description: 'Administrative status. "A" for Active businesses, "C" for Ceased/Closed businesses.'
      },
      
      // Boolean certification and label filters
      est_association: {
        type: 'boolean',
        description: 'Filter for associations only. Includes businesses with association identifier or association legal nature codes.'
      },
      est_bio: {
        type: 'boolean',
        description: 'Filter for businesses with at least one establishment certified organic by Agence Bio.'
      },
      est_collectivite_territoriale: {
        type: 'boolean',
        description: 'Filter for territorial collectivities (municipalities, departments, regions).'
      },
      est_entrepreneur_individuel: {
        type: 'boolean',
        description: 'Filter for individual entrepreneurs (sole proprietorships).'
      },
      est_entrepreneur_spectacle: {
        type: 'boolean',
        description: 'Filter for businesses with entertainment industry licenses.'
      },
      est_ess: {
        type: 'boolean',
        description: 'Filter for Social and Solidarity Economy (ESS) businesses.'
      },
      est_finess: {
        type: 'boolean',
        description: 'Filter for businesses with FINESS establishments (health and social sector).'
      },
      est_organisme_formation: {
        type: 'boolean',
        description: 'Filter for businesses with training organization establishments.'
      },
      est_patrimoine_vivant: {
        type: 'boolean',
        description: 'Filter for businesses with "Living Heritage Company" (EPV) label.'
      },
      est_qualiopi: {
        type: 'boolean',
        description: 'Filter for businesses with Qualiopi certification (training quality).'
      },
      est_rge: {
        type: 'boolean',
        description: 'Filter for businesses recognized as "Environmental Guarantors" (RGE) for energy renovation.'
      },
      est_siae: {
        type: 'boolean',
        description: 'Filter for Integration through Economic Activity structures (SIAE).'
      },
      est_service_public: {
        type: 'boolean',
        description: 'Filter for public service structures. Based on French administration list - may have false positives.'
      },
      est_l100_3: {
        type: 'boolean',
        description: 'Filter for administrations under article L. 100-3 of CRPA (public-administration relations code).'
      },
      est_societe_mission: {
        type: 'boolean',
        description: 'Filter for mission-driven companies (sociétés à mission).'
      },
      est_uai: {
        type: 'boolean',
        description: 'Filter for businesses with UAI (Administrative Registered Unit) establishments in education sector.'
      },
      est_achats_responsables: {
        type: 'boolean',
        description: 'Filter for businesses with "Responsible Supplier Relations and Purchases" (RFAR) label.'
      },
      est_alim_confiance: {
        type: 'boolean',
        description: 'Filter for businesses with at least one establishment having Alim\'Confiance food safety control results.'
      },
      convention_collective_renseignee: {
        type: 'boolean',
        description: 'Filter for businesses with at least one establishment having a collective agreement specified.'
      },
      egapro_renseignee: {
        type: 'boolean',
        description: 'Filter for businesses with professional gender equality index specified.'
      },
      
      // Financial filters
      ca_min: {
        type: 'integer',
        description: 'Minimum annual revenue/turnover in euros. Example: 100000 for €100,000 minimum revenue.',
        minimum: 0
      },
      ca_max: {
        type: 'integer',
        description: 'Maximum annual revenue/turnover in euros. Example: 1000000 for €1,000,000 maximum revenue.',
        minimum: 0
      },
      resultat_net_min: {
        type: 'integer',
        description: 'Minimum net result in euros. Can be negative. Example: -50000 for minimum loss threshold.',
      },
      resultat_net_max: {
        type: 'integer',
        description: 'Maximum net result in euros. Example: 500000 for €500,000 maximum profit.',
      },
      
      // Person-related filters (directors and elected officials)
      nom_personne: {
        type: 'string',
        description: 'Last name of a person involved in the business (director or elected official). Example: "Dupont"'
      },
      prenoms_personne: {
        type: 'string',
        description: 'First name(s) of a person involved in the business. Example: "Jean Pierre"'
      },
      date_naissance_personne_min: {
        type: 'string',
        format: 'date',
        description: 'Minimum birth date for person search in YYYY-MM-DD format. Example: "1960-01-01"'
      },
      date_naissance_personne_max: {
        type: 'string',
        format: 'date',
        description: 'Maximum birth date for person search in YYYY-MM-DD format. Example: "1990-12-31"'
      },
      type_personne: {
        type: 'string',
        enum: ['dirigeant', 'elu'],
        description: 'Type of person involvement. "dirigeant" for business directors/managers, "elu" for elected officials.'
      },
      
      // Specific identifier filters
      id_convention_collective: {
        type: 'string',
        description: 'Collective agreement identifier. Example: "1090" for SYNTEC collective agreement.'
      },
      id_finess: {
        type: 'string',
        description: 'FINESS identifier for health/social establishments. Example: "010003853"'
      },
      id_rge: {
        type: 'string',
        description: 'RGE (Environmental Guarantor) identifier. Example: "8611M10D109"'
      },
      id_uai: {
        type: 'string',
        description: 'UAI (Administrative Registered Unit) identifier for education. Example: "0022004T"'
      },
      
      // Response configuration
      limite_matching_etablissements: {
        type: 'integer',
        description: 'Number of related establishments to include in response (1-100). Default: 10. Higher values provide more establishment details.',
        minimum: 1,
        maximum: 100
      },
      minimal: {
        type: 'boolean',
        description: 'Return minimal response excluding secondary fields. Set to true for faster responses when you only need basic business information.'
      },
      include: {
        type: 'string',
        description: 'Include specific secondary fields when minimal=true. Values: "complements", "dirigeants", "finances", "matching_etablissements", "siege", "score". Comma-separated for multiple fields. Example: "siege,complements"'
      },
      
      // Pagination
      page: {
        type: 'integer',
        description: 'Page number to return (minimum 1). Default: 1',
        minimum: 1
      },
      per_page: {
        type: 'integer',
        description: 'Results per page (maximum 25). Default: 10. Use smaller values for faster responses.',
        minimum: 1,
        maximum: 25
      }
    },
    additionalProperties: false
  }
};

export const searchBusinessesNearbyTool: Tool = {
  name: 'search_businesses_nearby',
  description: `Search for French businesses near specific geographic coordinates. Find businesses within a radius around a given latitude/longitude point, with optional filtering by business activity.

**Key Features:**
- Search by precise geographic coordinates (latitude/longitude)
- Configurable search radius (up to 50km)
- Filter by business activity codes
- Same response format as text search

**Usage Examples:**
- Businesses near Paris center: {"lat": 48.8566, "long": 2.3522, "radius": 5}
- Restaurants near location: {"lat": 45.764, "long": 4.8357, "section_activite_principale": "I", "radius": 2}
- Tech companies nearby: {"lat": 48.8566, "long": 2.3522, "activite_principale": "62.01Z,62.02A"}`,
  inputSchema: {
    type: 'object',
    properties: {
      // Required coordinates
      lat: {
        type: 'number',
        description: 'Latitude in decimal degrees (-90 to 90). Example: 48.8566 for Paris center. Use precise coordinates for accurate results.',
        minimum: -90,
        maximum: 90
      },
      long: {
        type: 'number',
        description: 'Longitude in decimal degrees (-180 to 180). Example: 2.3522 for Paris center. Use precise coordinates for accurate results.',
        minimum: -180,
        maximum: 180
      },
      
      // Geographic search parameters
      radius: {
        type: 'number',
        description: 'Search radius in kilometers (maximum 50km). Default: 5km. Larger radius returns more results but may be slower.',
        minimum: 0.1,
        maximum: 50
      },
      
      // Activity filters
      activite_principale: {
        type: 'string',
        description: 'NAF/APE activity codes to filter results. Single code like "62.01Z" or comma-separated list like "01.12Z,28.15Z". Only businesses with these activities will be returned.'
      },
      section_activite_principale: {
        type: 'string',
        description: 'Activity section codes (A-U) to filter results. Values: A (Agriculture), B (Mining), C (Manufacturing), D (Energy), E (Water/Waste), F (Construction), G (Trade), H (Transport), I (Hospitality), J (IT/Communication), K (Finance), L (Real Estate), M (Professional), N (Administrative), O (Public Admin), P (Education), Q (Health), R (Arts), S (Other Services), T (Households), U (Extraterritorial). Comma-separated for multiple sections.',
        pattern: '^[A-U](,[A-U])*$'
      },
      
      // Response configuration
      limite_matching_etablissements: {
        type: 'integer',
        description: 'Number of related establishments to include in response (1-100). Default: 10. Higher values provide more establishment details.',
        minimum: 1,
        maximum: 100
      },
      minimal: {
        type: 'boolean',
        description: 'Return minimal response excluding secondary fields. Set to true for faster responses when you only need basic business information.'
      },
      include: {
        type: 'string',
        description: 'Include specific secondary fields when minimal=true. Values: "complements", "dirigeants", "finances", "matching_etablissements", "siege", "score". Comma-separated for multiple fields. Example: "siege,complements"'
      },
      
      // Pagination
      page: {
        type: 'integer',
        description: 'Page number to return (minimum 1). Default: 1',
        minimum: 1
      },
      per_page: {
        type: 'integer',
        description: 'Results per page (maximum 25). Default: 10. Use smaller values for faster responses.',
        minimum: 1,
        maximum: 25
      }
    },
    required: ['lat', 'long'],
    additionalProperties: false
  }
};

export const tools = [searchBusinessesTool, searchBusinessesNearbyTool];