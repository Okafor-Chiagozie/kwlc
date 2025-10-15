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

// Enums from API documentation
export enum Currency {
  NGN = "NGN",
  USD = "USD",
  EUR = "EUR", 
  GBP = "GBP",
  CAD = "CAD",
  AUD = "AUD",
  JPY = "JPY",
  CNY = "CNY",
  INR = "INR",
  ZAR = "ZAR"
}

export enum PurposeCode {
  DON = "DON",
  EVT = "EVT", 
  CDON = "CDON",
  PUR = "PUR"
}

export enum DonationType {
  Project = "Project",
  Community = "Community"
}

export enum PaymentMethod {
  Card = "card",
  BankTransfer = "bank_transfer",
  Cash = "cash"
}

// Request/Response schemas exactly as defined in API documentation

// AddDonationViewModel from API
export interface AddDonationViewModel {
  email: string;
  amount: number;
  message?: string; // Made optional and nullable to match API
  currencyId: Currency;
  donorName?: string; // Made optional and nullable to match API
  isAnnonymous: boolean;
  phoneNumber?: string; // Made optional and nullable to match API
  churchProjectId?: number | null;
  purposeCode: PurposeCode;
  donationTypeId: DonationType;
  paymenMethodId: PaymentMethod;
}

// CustomerInfo from API
export interface CustomerInfo {
  name: string;
  email: string;
  phoneNumber: string;
}

// FincraCheckoutData from API
export interface FincraCheckoutData {
  status: boolean;
  message: string;
  data: FincraCheckoutURL;
}

export interface FincraCheckoutURL {
  checkoutUrl: string;
}

// CheckoutResponse from API
export interface CheckoutResponse {
  data: FincraCheckoutData;
}

// PaymentDetails from API
export interface PaymentDetails {
  id: number;
  businessId: string;
  paymentLinkId: string;
  amount: number;
  currency: string;
  convertedAmount: number;
  amountReceived: number;
  convertedCurrency: string;
  paymentMethods: string[];
  defaultPaymentMethod: string;
  redirectUrl: string;
  customUrl: string;
  successMessage: string;
  settlementDestination: string;
  settlementTime: string;
  feeBearer: string;
  reference: string;
  merchantReference: string;
  isDisabled: boolean;
  metadata: any;
  status: string;
  varianceType: string;
  createdAt: string; // DateTime
  updatedAt: string; // DateTime
  customer: CustomerInfo;
  amountExpected: number;
  message: string;
  actionRequired: string;
}

// PaymentDetailsResponse from API
export interface PaymentDetailsResponse {
  status: boolean;
  message: string;
  data: PaymentDetails;
}

// Request types
export type InitiateDonationRequest = AddDonationViewModel;
export type VerifyDonationRequest = string; // Reference string
export type GetChurchProjectDonationsRequest = {
  churchProjectId: number;
  searchFilter: SearchFilter;
};
export type GetCommunityDonationsRequest = SearchFilter;

// Response interfaces matching API exactly
export interface InitiateDonationResponse extends CheckoutResponse {}
export interface VerifyDonationResponse extends PaymentDetailsResponse {}
export interface GetChurchProjectDonationsResponse extends CheckoutResponse {}
export interface GetCommunityDonationsResponse extends PaymentDetailsResponse {}
export interface GetDonationResponse extends PaymentDetailsResponse {}
export interface DeleteDonationResponse extends PaymentDetailsResponse {}
