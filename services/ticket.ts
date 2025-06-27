import api from '@/lib/axios';
import {
  CreateOrUpdateTicketRequest,
  CreateOrUpdateTicketResponse,
  GetTicketResponse,
  GetTicketByIdResponse,
  VerifyTicketPaymentResponse,
  DeleteTicketApiResponse
} from '@/types/ticket';

export const createOrUpdateTicket = async (
  payload: CreateOrUpdateTicketRequest
): Promise<CreateOrUpdateTicketResponse> => {
  const response = await api.post<CreateOrUpdateTicketResponse>(
    '/api/v1/Ticket/CreateOrUpdateTicket',
    payload
  );
  return response.data;
};

export const getTicket = async (
  ticketNumber: string
): Promise<GetTicketResponse> => {
  const response = await api.get<GetTicketResponse>(
    `/api/v1/Ticket/GetTicket?ticketNumber=${encodeURIComponent(ticketNumber)}`
  );
  return response.data;
};

export const getTicketById = async (
  id: number
): Promise<GetTicketByIdResponse> => {
  const response = await api.get<GetTicketByIdResponse>(
    `/api/v1/Ticket/GetTicketById?id=${id}`
  );
  return response.data;
};

export const verifyTicketPayment = async (
  ticketNumber: string
): Promise<VerifyTicketPaymentResponse> => {
  const response = await api.get<VerifyTicketPaymentResponse>(
    `/api/v1/Ticket/VerifyTicketPayment?ticketNumber=${encodeURIComponent(ticketNumber)}`
  );
  return response.data;
};

export const deleteTicket = async (
  ticketId: number
): Promise<DeleteTicketApiResponse> => {
  const response = await api.delete<DeleteTicketApiResponse>(
    `/api/v1/Ticket/DeleteTicket?ticketId=${ticketId}`
  );
  return response.data;
};