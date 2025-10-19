import type { 
  SearchBusinessesParams, 
  SearchNearbyParams, 
  ApiResponse, 
  ApiErrorResponse,
  RateLimiter 
} from './types.js';

/**
 * Simple rate limiter to enforce the 7 requests per second limit
 */
class SimpleRateLimiter implements RateLimiter {
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

/**
 * HTTP client for the API Recherche d'Entreprises with rate limiting
 */
export class ApiClient {
  private readonly baseUrl = 'https://recherche-entreprises.api.gouv.fr';
  private readonly rateLimiter: RateLimiter;

  constructor() {
    this.rateLimiter = new SimpleRateLimiter();
  }

  /**
   * Build query string from parameters, filtering out undefined values
   */
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        // Convert boolean to lowercase string
        if (typeof value === 'boolean') {
          searchParams.append(key, value.toString().toLowerCase());
        } else {
          searchParams.append(key, value.toString());
        }
      }
    }
    
    return searchParams.toString();
  }

  /**
   * Make HTTP request with rate limiting and error handling
   */
  private async makeRequest(url: string): Promise<ApiResponse | ApiErrorResponse> {
    await this.rateLimiter.wait();

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MCP-Server-Recherche-Entreprises/1.0.0'
        }
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. The API accepts maximum 7 requests per second.');
        }
        if (response.status === 400) {
          const errorData = await response.json() as ApiErrorResponse;
          throw new Error(`Bad request: ${errorData.erreur}`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while making API request');
    }
  }

  /**
   * Search businesses using text search parameters
   */
  async searchBusinesses(params: SearchBusinessesParams): Promise<ApiResponse> {
    // Validate that at least one search parameter is provided
    const hasSearchParam = params.q || 
      params.activite_principale ||
      params.code_postal ||
      params.departement ||
      params.region ||
      params.nom_personne ||
      Object.keys(params).some(key => key.startsWith('est_') && params[key as keyof SearchBusinessesParams] === true);

    if (!hasSearchParam) {
      throw new Error('At least one search parameter must be provided (q, activite_principale, location filters, person filters, or boolean filters)');
    }

    // Validate per_page limit
    if (params.per_page && params.per_page > 25) {
      throw new Error('per_page parameter cannot exceed 25');
    }

    // Validate page minimum
    if (params.page && params.page < 1) {
      throw new Error('page parameter must be at least 1');
    }

    // Validate date formats
    if (params.date_naissance_personne_min && !/^\\d{4}-\\d{2}-\\d{2}$/.test(params.date_naissance_personne_min)) {
      throw new Error('date_naissance_personne_min must be in YYYY-MM-DD format');
    }
    if (params.date_naissance_personne_max && !/^\\d{4}-\\d{2}-\\d{2}$/.test(params.date_naissance_personne_max)) {
      throw new Error('date_naissance_personne_max must be in YYYY-MM-DD format');
    }

    // Validate departement pattern
    if (params.departement && !/^\\b([013-8]\\d?|2[aAbB1-9]?|9[0-59]?|97[12346])\\b$/.test(params.departement)) {
      throw new Error('departement must be a valid French department code (2-3 digits)');
    }

    // Validate limite_matching_etablissements range
    if (params.limite_matching_etablissements && (params.limite_matching_etablissements < 1 || params.limite_matching_etablissements > 100)) {
      throw new Error('limite_matching_etablissements must be between 1 and 100');
    }

    // Validate include parameter can only be used with minimal=true
    if (params.include && !params.minimal) {
      throw new Error('include parameter can only be used when minimal=true');
    }

    const queryString = this.buildQueryString(params);
    const url = `${this.baseUrl}/search?${queryString}`;
    
    const result = await this.makeRequest(url);
    
    if ('erreur' in result) {
      throw new Error(result.erreur);
    }
    
    return result;
  }

  /**
   * Search businesses near geographic coordinates
   */
  async searchNearby(params: SearchNearbyParams): Promise<ApiResponse> {
    // Validate required parameters
    if (params.lat === undefined || params.long === undefined) {
      throw new Error('Both lat and long parameters are required');
    }

    // Validate latitude range
    if (params.lat < -90 || params.lat > 90) {
      throw new Error('Latitude must be between -90 and 90 degrees');
    }

    // Validate longitude range
    if (params.long < -180 || params.long > 180) {
      throw new Error('Longitude must be between -180 and 180 degrees');
    }

    // Validate radius
    if (params.radius && (params.radius <= 0 || params.radius > 50)) {
      throw new Error('Radius must be between 0 and 50 kilometers');
    }

    // Validate per_page limit
    if (params.per_page && params.per_page > 25) {
      throw new Error('per_page parameter cannot exceed 25');
    }

    // Validate page minimum
    if (params.page && params.page < 1) {
      throw new Error('page parameter must be at least 1');
    }

    // Validate limite_matching_etablissements range
    if (params.limite_matching_etablissements && (params.limite_matching_etablissements < 1 || params.limite_matching_etablissements > 100)) {
      throw new Error('limite_matching_etablissements must be between 1 and 100');
    }

    // Validate include parameter can only be used with minimal=true
    if (params.include && !params.minimal) {
      throw new Error('include parameter can only be used when minimal=true');
    }

    const queryString = this.buildQueryString(params);
    const url = `${this.baseUrl}/near_point?${queryString}`;
    
    const result = await this.makeRequest(url);
    
    if ('erreur' in result) {
      throw new Error(result.erreur);
    }
    
    return result;
  }
}