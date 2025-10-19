/**
 * TypeScript interfaces for the French Government's API Recherche d'Entreprises
 * Based on OpenAPI specification 3.0.0
 */

// Enum types based on OpenAPI schema
export type CategorieEntreprise = 'PME' | 'ETI' | 'GE';
export type EtatAdministratif = 'A' | 'C';
export type TypePersonne = 'dirigeant' | 'elu';
export type SectionActivitePrincipale = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U';
export type IncludeFields = 'complements' | 'dirigeants' | 'finances' | 'matching_etablissements' | 'siege' | 'score';

// Main search parameters interface for /search endpoint
export interface SearchBusinessesParams {
  // Required parameter
  q?: string;
  
  // Activity and business classification
  activite_principale?: string;
  categorie_entreprise?: CategorieEntreprise;
  section_activite_principale?: string;
  nature_juridique?: string;
  tranche_effectif_salarie?: string;
  
  // Geographic filters
  code_postal?: string;
  code_commune?: string;
  departement?: string;
  region?: string;
  epci?: string;
  code_collectivite_territoriale?: string;
  
  // Administrative status
  etat_administratif?: EtatAdministratif;
  
  // Boolean filters for certifications and labels
  est_association?: boolean;
  est_bio?: boolean;
  est_collectivite_territoriale?: boolean;
  est_entrepreneur_individuel?: boolean;
  est_entrepreneur_spectacle?: boolean;
  est_ess?: boolean;
  est_finess?: boolean;
  est_organisme_formation?: boolean;
  est_patrimoine_vivant?: boolean;
  est_qualiopi?: boolean;
  est_rge?: boolean;
  est_siae?: boolean;
  est_service_public?: boolean;
  est_l100_3?: boolean;
  est_societe_mission?: boolean;
  est_uai?: boolean;
  est_achats_responsables?: boolean;
  est_alim_confiance?: boolean;
  convention_collective_renseignee?: boolean;
  egapro_renseignee?: boolean;
  
  // Financial filters
  ca_min?: number;
  ca_max?: number;
  resultat_net_min?: number;
  resultat_net_max?: number;
  
  // Person-related filters
  nom_personne?: string;
  prenoms_personne?: string;
  date_naissance_personne_min?: string;
  date_naissance_personne_max?: string;
  type_personne?: TypePersonne;
  
  // Specific ID filters
  id_convention_collective?: string;
  id_finess?: string;
  id_rge?: string;
  id_uai?: string;
  
  // Response configuration
  limite_matching_etablissements?: number;
  minimal?: boolean;
  include?: string;
  
  // Pagination
  page?: number;
  per_page?: number;
}

// Geographic search parameters for /near_point endpoint
export interface SearchNearbyParams {
  // Required coordinates
  lat: number;
  long: number;
  
  // Optional parameters
  radius?: number;
  activite_principale?: string;
  section_activite_principale?: string;
  limite_matching_etablissements?: number;
  minimal?: boolean;
  include?: string;
  page?: number;
  per_page?: number;
}

// Financial data structure
export interface FinancialData {
  ca: number;
  resultat_net: number;
}

export interface Finances {
  [year: string]: FinancialData;
}

// Dirigeant interfaces (person vs company)
export interface DirigentPersonnePhysique {
  nom: string;
  prenoms: string;
  annee_de_naissance: string;
  date_de_naissance: string;
  qualite: string;
  nationalite: string;
  type_dirigeant: 'personne physique';
}

export interface DirigentPersonneMorale {
  siren: string;
  denomination: string;
  qualite: string;
  type_dirigeant: 'personne morale';
}

export type Dirigeant = DirigentPersonnePhysique | DirigentPersonneMorale;

// Elected official interface
export interface Elu {
  nom: string;
  prenoms: string;
  annee_de_naissance: string;
  fonction: string;
  sexe: string;
}

// Territorial collectivity interface
export interface CollectiviteTerritoriale {
  code_insee: string;
  code: string;
  niveau: string;
  elus: Elu[];
}

// Establishment interface (comprehensive)
export interface Etablissement {
  activite_principale: string;
  activite_principale_registre_metier?: string;
  annee_tranche_effectif_salarie?: string;
  adresse: string;
  caractere_employeur: string;
  cedex?: string;
  code_pays_etranger?: string;
  code_postal?: string;
  commune?: string;
  complement_adresse?: string;
  date_creation?: string;
  date_fermeture?: string;
  date_debut_activite?: string;
  date_mise_a_jour?: string;
  departement?: string;
  distribution_speciale?: string;
  est_siege: boolean;
  etat_administratif: string;
  geo_id?: string;
  indice_repetition?: string;
  latitude: string;
  libelle_cedex?: string;
  libelle_commune: string;
  libelle_commune_etranger?: string;
  libelle_pays_etranger?: string;
  libelle_voie: string;
  liste_enseignes?: string[];
  liste_finess?: string[];
  liste_idcc: string[];
  liste_id_bio: string[];
  liste_rge: string[];
  liste_uai: string[];
  longitude: string;
  nom_commercial?: string;
  numero_voie: string;
  region?: string;
  epci?: string;
  siret: string;
  statut_diffusion_etablissement: string;
  tranche_effectif_salarie: string;
  type_voie: string;
  
  // Additional fields for matching establishments
  ancien_siege?: boolean;
  liste_id_organisme_formation?: string[];
}

// Complements structure
export interface Complements {
  collectivite_territoriale?: CollectiviteTerritoriale;
  convention_collective_renseignee: boolean;
  liste_idcc: string[];
  egapro_renseignee: boolean;
  est_achats_responsables: boolean;
  est_alim_confiance: boolean;
  est_association: boolean;
  est_bio: boolean;
  est_entrepreneur_individuel: boolean;
  est_entrepreneur_spectacle: boolean;
  est_ess: boolean;
  est_finess: boolean;
  est_organisme_formation: boolean;
  est_patrimoine_vivant: boolean;
  est_qualiopi: boolean;
  liste_id_organisme_formation: string[];
  est_rge: boolean;
  est_siae: boolean;
  est_service_public: boolean;
  est_l100_3: boolean;
  est_societe_mission: boolean;
  est_uai: boolean;
  bilan_ges_renseigne: boolean;
  identifiant_association?: string;
  statut_bio: boolean;
  statut_entrepreneur_spectacle?: string;
  type_siae?: string;
}

// Main business result interface
export interface BusinessResult {
  siren: string;
  nom_complet: string;
  nom_raison_sociale: string;
  sigle?: string;
  nombre_etablissements: number;
  nombre_etablissements_ouverts: number;
  siege: Etablissement;
  date_creation: string;
  date_fermeture?: string;
  tranche_effectif_salarie: string;
  annee_tranche_effectif_salarie: string;
  date_mise_a_jour: string;
  categorie_entreprise: string;
  caractere_employeur: string;
  annee_categorie_entreprise: string;
  etat_administratif: string;
  nature_juridique: string;
  activite_principale: string;
  section_activite_principale: string;
  statut_diffusion: string;
  matching_etablissements: Etablissement[];
  dirigeants: Dirigeant[];
  finances: Finances;
  complements: Complements;
}

// API Response structure
export interface ApiResponse {
  results: BusinessResult[];
  total_results: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Error response structure
export interface ApiErrorResponse {
  erreur: string;
}

// Rate limiter interface
export interface RateLimiter {
  wait(): Promise<void>;
}

// MCP Tool parameter schemas for better type checking
export interface SearchBusinessesTool {
  name: 'search_businesses';
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    additionalProperties: boolean;
  };
}

export interface SearchNearbyTool {
  name: 'search_businesses_nearby';
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
    additionalProperties: boolean;
  };
}