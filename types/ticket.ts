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

export interface CreateOrUpdateTicketRequest {
  id: number;
  eventId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  file: string;
}

export interface TicketCreateResponse {
  id: number;
  dateCreated: string;
  lastModified: string;
  eventId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  eventName: string;
  email: string;
  ticketNumber: string;
  seatNumber: number;
  price: number;
  paymentStatus: boolean;
  imageUrl: string;
}

export interface TicketData {
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

export interface DeleteTicketResponse {
  id: number;
  name: string;
  lgaId: number;
  lga: string;
  stateId: number;
  state: string;
  email: string;
  countryId: number;
  country: string;
  address: string;
  location: string;
  isDeleted: boolean;
  phoneNumber: string;
  dateCreated: string;
  imageUrl: string;
  welcomeAddress: string;
  dateDeleted: string;
}

export interface CreateOrUpdateTicketResponse extends StandardApiResponse<TicketCreateResponse[]> {}

export interface GetTicketResponse extends StandardApiResponse<TicketData[]> {}

export interface GetTicketByIdResponse extends StandardApiResponse<TicketData[]> {}

export interface VerifyTicketPaymentResponse extends StandardApiResponse<TicketData[]> {}

export interface DeleteTicketApiResponse extends StandardApiResponse<DeleteTicketResponse[]> {}