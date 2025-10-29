import api from '@/lib/axios';

export interface SelectOption {
  id: number;
  name: string;
}

export interface SelectOptionListResult {
  data: SelectOption[];
  isSuccessful: boolean;
  errors?: any;
  responseMessage?: string;
  responseCode?: string;
}

const BASE_URL = '/api/v1/Select';

export const getCurrencies = async (): Promise<SelectOptionListResult> => {
  const response = await api.get<SelectOptionListResult>(`${BASE_URL}/Currency`);
  return response.data;
};

export const getPaymentTypes = async (): Promise<SelectOptionListResult> => {
  const response = await api.get<SelectOptionListResult>(`${BASE_URL}/PaymentType`);
  return response.data;
};





