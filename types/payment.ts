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

export enum PaymentMethod {
  Card = "card",
  BankTransfer = "bank_transfer",
  Cash = "cash"
}

// Request/Response schemas exactly as defined in API documentation

// PaymentRequest from API
export interface PaymentRequest {
  entryId: number;
  amount: number;
  currencyId: Currency;
  name: string;
  email: string;
  phoneNumber: string;
  reference: string;
  purpose: PurposeCode;
  paymenMethod: PaymentMethod; // Note: API has typo - "paymenMethod" not "paymentMethod"
  callbackUrl: string;
}

// CustomerInfo from API
export interface CustomerInfo {
  name: string;
  email: string;
  phoneNumber: string;
}

// FincraCheckoutData from API
export interface FincraCheckoutData {
  checkoutUrl: string;
}

// CheckoutResponse from API
export interface CheckoutResponse {
  status: boolean;
  message: string;
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
export type InitiatePaymentRequest = PaymentRequest;
export type VerifyPaymentRequest = string; // Reference string
export type ProcessPaymentWebHookRequest = {
  signature: string; // Header parameter
  payload: any; // Request body
};

// Response interfaces matching API exactly
export interface InitiatePaymentResponse extends CheckoutResponse {}
export interface VerifyPaymentResponse extends PaymentDetailsResponse {}
export interface ProcessPaymentWebHookResponse extends PaymentDetailsResponse {}