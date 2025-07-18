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

// Request/Response schemas exactly as defined in API documentation

// TicketViewModel from API (used in livestream responses)
export interface TicketViewModel {
  id?: number | null;
  eventId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  file: string;
  ticketNumber: string;
  seatNumber?: number | null;
  price: number;
  paymentStatus: boolean;
  imageUrl: string;
  eventName: string;
}

// Request types
export type GetCompletedStreamsRequest = SearchFilter;
export type GetUpcomingStreamsRequest = SearchFilter;
export type GetAllAvailableStreamsRequest = SearchFilter;

// Response types based on API documentation
export interface TicketViewModelListResult extends StandardApiResponse<TicketViewModel[]> {}

// Response interfaces matching API exactly
export interface GetLivestreamUrlResponse extends TicketViewModelListResult {}
export interface GetCompletedStreamsResponse extends TicketViewModelListResult {}
export interface GetUpcomingStreamsResponse extends TicketViewModelListResult {}
export interface GetAllAvailableStreamsResponse extends TicketViewModelListResult {}
export interface GetStreamDetailsByURLResponse extends TicketViewModelListResult {}
export interface GetStreamDetailsByIdResponse extends TicketViewModelListResult {}
export interface DeleteStreamResponse extends TicketViewModelListResult {}