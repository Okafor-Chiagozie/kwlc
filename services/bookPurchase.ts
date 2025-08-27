import api from '@/lib/axios';
import {
  AddBookOrderRequest,
  InitiateOrderResponse,
  VerifyBookPurchaseRequest,
  VerifyBookPurchaseResponse,
  GetBookPurchasesRequest,
  GetBookPurchasesResponse,
  GetBookPurchaseResponse,
  DeleteBookPurchaseResponse,
  BookPurchaseSummaryResult
} from '@/types/book';

const BASE_URL = '/api/v1/BookPurchase';

// Book Purchase operations
export const initiateOrder = async (
  payload: AddBookOrderRequest
): Promise<InitiateOrderResponse> => {
  const response = await api.post<InitiateOrderResponse>(
    `${BASE_URL}/InitiateOrder`,
    payload
  );
  return response.data;
};

export const verifyBookPurchase = async (
  reference: VerifyBookPurchaseRequest
): Promise<VerifyBookPurchaseResponse> => {
  const response = await api.post<VerifyBookPurchaseResponse>(
    `${BASE_URL}/VerifyBookPurchase`,
    reference, // Send as string in request body
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const getBookPurchases = async (
  payload: GetBookPurchasesRequest
): Promise<GetBookPurchasesResponse> => {
  const response = await api.post<GetBookPurchasesResponse>(
    `${BASE_URL}/GetBookPurchases`,
    payload
  );
  return response.data;
};

export const getBookPurchaseSummary = async (): Promise<BookPurchaseSummaryResult> => {
  const response = await api.get<BookPurchaseSummaryResult>(
    `${BASE_URL}/BookPurchaseSummary`
  );
  return response.data;
};

export const getBookPurchase = async (
  id: string
): Promise<GetBookPurchaseResponse> => {
  const response = await api.get<GetBookPurchaseResponse>(
    `${BASE_URL}/GetBookPurchase?Id=${encodeURIComponent(id)}`
  );
  return response.data;
};

export const deleteBookPurchase = async (
  id: string
): Promise<DeleteBookPurchaseResponse> => {
  const response = await api.delete<DeleteBookPurchaseResponse>(
    `${BASE_URL}/DeletebookPurchase?Id=${encodeURIComponent(id)}` // Note: API endpoint has typo 'DeletebookPurchase' (lowercase 'b')
  );
  return response.data;
};
