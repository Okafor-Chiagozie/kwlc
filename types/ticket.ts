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

// Request/Response schemas exactly as defined in API documentation

// AddTicketViewModel from API
export interface AddTicketViewModel {
  id?: number | null;
  eventId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  file?: File | null;
}

// Ticket from API (detailed ticket object)
export interface Ticket {
  id: number;
  dateCreated: string; // DateTime
  lastModified: string; // DateTime
  eventId: number;
  email: string;
  price: number;
  seatNumber?: number | null;
  lastName: string;
  eventName: string;
  firstName: string;
  reference: string;
  imageUrl: string;
  phoneNumber: string;
  paymentStatus: boolean;
  ticketNumber: string;
}

// TicketViewModel from API
export interface TicketViewModel {
  id?: number | null;
  eventId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  file?: File | null;
  ticketNumber: string;
  seatNumber?: number | null;
  price: number;
  paymentStatus: boolean;
  imageUrl: string;
  eventName: string;
}

// BranchViewModel from API (used in delete response)
export interface BranchViewModel {
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
  dateDeleted?: string;
}

// Request types
export type CreateOrUpdateTicketRequest = AddTicketViewModel;

// Response types based on API documentation
export interface TicketListResult extends StandardApiResponse<Ticket[]> {}
export interface TicketViewModelListResult extends StandardApiResponse<TicketViewModel[]> {}
export interface BranchViewModelListResult extends StandardApiResponse<BranchViewModel[]> {}

// Response interfaces matching API exactly
export interface CreateOrUpdateTicketResponse extends TicketListResult {}
export interface GetTicketResponse extends TicketViewModelListResult {}
export interface GetTicketByIdResponse extends TicketViewModelListResult {}
export interface VerifyTicketPaymentResponse extends TicketViewModelListResult {}
export interface DeleteTicketResponse extends BranchViewModelListResult {}