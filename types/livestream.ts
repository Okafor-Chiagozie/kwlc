// types/livestream.ts
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

export interface LivestreamData {
  id: number;
  eventId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  file: string;
  ticketNumber: string;
  seatNumber: number;
  price: number;
  paymentStatus: boolean;
  imageUrl: string;
  eventName: string;
}

export interface PaginatedRequest {
  pageSize: number;
  pageNumber: number;
  searchParams?: Record<string, string>;
}

export interface GetLivestreamUrlResponse extends StandardApiResponse<LivestreamData[]> {}

export interface GetCompletedStreamsRequest extends PaginatedRequest {}
export interface GetCompletedStreamsResponse extends StandardApiResponse<LivestreamData[]> {}

export interface GetUpcomingStreamsRequest extends PaginatedRequest {}
export interface GetUpcomingStreamsResponse extends StandardApiResponse<LivestreamData[]> {}

export interface GetAllAvailableStreamsRequest extends PaginatedRequest {}
export interface GetAllAvailableStreamsResponse extends StandardApiResponse<LivestreamData[]> {}

export interface GetStreamDetailsByURLResponse extends StandardApiResponse<LivestreamData[]> {}

export interface GetStreamDetailsByIdResponse extends StandardApiResponse<LivestreamData[]> {}

export interface DeleteStreamResponse extends StandardApiResponse<LivestreamData[]> {}