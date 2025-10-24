import api from '@/lib/axios';
import {
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  ProcessPaymentWebHookRequest,
  ProcessPaymentWebHookResponse,
  PaymentDetailsResponse
} from '@/types/payment';

const BASE_URL = '/api/v1/Payment';

// Payment operations
export const initiatePayment = async (
  payload: InitiatePaymentRequest
): Promise<InitiatePaymentResponse> => {
  // Map to API's expected payload keys (paymenMethod typo per API schema)
  const apiPayload: any = {
    entryId: payload.entryId,
    amount: payload.amount,
    currencyId: payload.currencyId,
    name: payload.name,
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    reference: payload.reference,
    purpose: payload.purpose,
    paymenMethod: (payload as any).paymentMethod ?? (payload as any).paymenMethod, // ensure API key
    callbackUrl: payload.callbackUrl,
  };

  const response = await api.post<InitiatePaymentResponse>(
    `https://musharealestate-001-site4.jtempurl.com/api/v1/Payment/InitiatePayment`,
    apiPayload,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const verifyPayment = async (
  reference: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> => {
  const response = await api.post<VerifyPaymentResponse>(
    `${BASE_URL}/VerifyPayment`,
    reference, // Send as string in request body
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const processPaymentWebHook = async (
  signature: string,
  payload: any
): Promise<ProcessPaymentWebHookResponse> => {
  const response = await api.get<ProcessPaymentWebHookResponse>(
    `${BASE_URL}/ProcessPaymentWebHook`,
    {
      headers: {
        'signature': signature, // Header parameter as specified in API
      },
      data: payload // Request body
    }
  );
  return response.data;
};

// Ticket payment verification (part of Payment API)
export const verifyTicketPayment = async (
  ticketId: number
): Promise<PaymentDetailsResponse> => {
  const response = await api.get<PaymentDetailsResponse>(
    `/api/v1/Ticket/VerifyTicketPayment?ticketId=${ticketId}`
  );
  return response.data;
};
