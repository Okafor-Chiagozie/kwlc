import api from '@/lib/axios';
import {
  GetCountriesResponse,
  GetStatesResponse,
  GetLGAsResponse,
  GetCountriesRequest,
  GetStatesByCountryRequest,
  GetLGAsByStateRequest
} from '@/types/countryStateLGA';

const BASE_URL = '/api/v1/CountryStateLGA';

// Geographic location data operations
// Endpoints confirmed to exist in API:
// GET /api/v1/CountryStateLGA/countries
// GET /api/v1/CountryStateLGA/{countryId}/states
// GET /api/v1/CountryStateLGA/{countryId}/{stateId}/lgas

export const getCountries = async (
  request?: GetCountriesRequest
): Promise<GetCountriesResponse> => {
  const response = await api.get<GetCountriesResponse>(
    `${BASE_URL}/countries`
  );
  return response.data;
};

export const getStatesByCountry = async (
  countryId: GetStatesByCountryRequest
): Promise<GetStatesResponse> => {
  const response = await api.get<GetStatesResponse>(
    `${BASE_URL}/${countryId}/states`
  );
  return response.data;
};

export const getLGAsByState = async (
  request: GetLGAsByStateRequest
): Promise<GetLGAsResponse> => {
  const response = await api.get<GetLGAsResponse>(
    `${BASE_URL}/${request.countryId}/${request.stateId}/lgas`
  );
  return response.data;
};
