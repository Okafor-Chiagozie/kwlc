// Base interfaces
export interface ApiError {
  field: string;
  description: string;
}

export interface StandardApiResponse<T = any> {
  data: T;
  isSuccessful: boolean;
  errors: ApiError[];
  responseMessage: string;
  responseCode: string;
}

export interface SearchFilter {
  pageSize: number;
  pageNumber: number;
  searchParams?: Record<string, string>;
}

// Geographic location data models
export interface Country {
  id: number;
  name: string;
  code?: string; // ISO country code
  phoneCode?: string;
  currency?: string;
  flag?: string;
}

export interface State {
  id: number;
  name: string;
  countryId: number;
  code?: string; // State code
  capital?: string;
}

export interface LGA {
  id: number;
  name: string;
  stateId: number;
  countryId: number;
  population?: number;
  area?: number;
}

// Request types
export type GetCountriesRequest = void;
export type GetStatesByCountryRequest = number; // countryId
export type GetLGAsByStateRequest = {
  countryId: number;
  stateId: number;
};

// Response types based on API documentation
export interface CountryListResult extends StandardApiResponse<Country[]> {}
export interface StateListResult extends StandardApiResponse<State[]> {}
export interface LGAListResult extends StandardApiResponse<LGA[]> {}

// Response interfaces matching API exactly
export interface GetCountriesResponse extends CountryListResult {}
export interface GetStatesResponse extends StateListResult {}
export interface GetLGAsResponse extends LGAListResult {}
