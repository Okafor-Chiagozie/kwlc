import api from '@/lib/axios';
import {
  CreateOrUpdateTicketRequest,
  CreateOrUpdateTicketResponse,
  GetTicketResponse,
  GetTicketByIdResponse,
  VerifyTicketPaymentResponse,
  DeleteTicketResponse
} from '@/types/ticket';

const BASE_URL = '/api/v1/Ticket';

// Ticket operations
export const createOrUpdateTicket = async (
  payload: CreateOrUpdateTicketRequest
): Promise<CreateOrUpdateTicketResponse> => {
  const response = await api.post<CreateOrUpdateTicketResponse>(
    `${BASE_URL}/CreateOrUpdateTicket`,
    payload
  );
  return response.data;
};

export const getTicket = async (
  ticketNumber: string
): Promise<GetTicketResponse> => {
  const response = await api.get<GetTicketResponse>(
    `${BASE_URL}/GetTicket?ticketNumber=${encodeURIComponent(ticketNumber)}`
  );
  return response.data;
};

export const getTicketById = async (
  id: number
): Promise<GetTicketByIdResponse> => {
  const response = await api.get<GetTicketByIdResponse>(
    `${BASE_URL}/GetTicketById?id=${id}`
  );
  return response.data;
};

export const verifyTicketPayment = async (
  ticketNumber: string
): Promise<VerifyTicketPaymentResponse> => {
  const response = await api.get<VerifyTicketPaymentResponse>(
    `${BASE_URL}/VerifyTicketPayment?ticketNumber=${encodeURIComponent(ticketNumber)}`
  );
  return response.data;
};

export const deleteTicket = async (
  ticketId: number
): Promise<DeleteTicketResponse> => {
  const response = await api.delete<DeleteTicketResponse>(
    `${BASE_URL}/DeleteTicket?ticketId=${ticketId}`
  );
  return response.data;
};