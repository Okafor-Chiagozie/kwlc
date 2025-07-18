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
export enum DayOfWeek {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday", 
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday"
}

export enum ChurchImageCategory {
  CarouselImage = "CarouselImage",
  FellowshipImage = "FellowshipImage",
  BibleStudyImage = "BibleStudyImage",
  CommunityImage = "CommunityImage",
  ChurchEventImage = "ChurchEventImage",
  ChurchServiceImage = "ChurchServiceImage",
  ChurchWeddingImage = "ChurchWeddingImage",
  ChurchLiveStreamImage = "ChurchLiveStreamImage"
}

// Time interface from API
export interface TimeOnly {
  hour: number;
  minute: number;
  second?: number;
  millisecond?: number;
  microsecond?: number;
  nanosecond?: number;
  ticks?: number;
}

// Request/Response schemas exactly as defined in API documentation

// Ticket from API (used in homepage responses)
export interface Ticket {
  id: number;
  dateCreated: string;
  lastModified: string;
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

// AddChurchViewModel from API
export interface AddChurchViewModel {
  id?: number | null;
  name: string;
  email: string;
  address: string;
  location: string;
  phoneNumber: string;
  welcomeAddress: string;
}

// AddServiceScheduleViewModel from API
export interface AddServiceScheduleViewModel {
  id?: number | null;
  name: string;
  churchDays: AddChurchdayViewModel[];
}

// AddChurchdayViewModel from API
export interface AddChurchdayViewModel {
  id?: number | null;
  day: DayOfWeek;
  startTime: TimeOnly;
  closeTime: TimeOnly;
}

// ChurchImageViewModel from API
export interface ChurchImageViewModel {
  id?: number | null;
  imageUrl: string;
  imageName: string;
  imageCategoryId: ChurchImageCategory;
}

// ChurchImageResponseViewModel from API
export interface ChurchImageResponseViewModel {
  carouselImages: ChurchImageViewModel[];
  bibleStudyImage: ChurchImageViewModel;
  communityImage: ChurchImageViewModel;
  fellowshipImage: ChurchImageViewModel;
  weddingImage: ChurchImageViewModel;
  churchLivestreamImage: ChurchImageViewModel;
  churchEventImage: ChurchImageViewModel;
}

// Request types
export type CreateOrUpdateChurchDetailsRequest = AddChurchViewModel;
export type CreateOrUpdateServiceScheduleDetailsRequest = AddServiceScheduleViewModel;
export type CreateOrUpdateChurchdayDetailsRequest = AddChurchdayViewModel[];
export type CreateChurchImageRequest = {
  ImageCategoryId: ChurchImageCategory;
  File: File[];
};
export type UpdateChurchImageRequest = {
  Id: number;
  file: File;
};

// Response types based on API documentation
export interface TicketListResult extends StandardApiResponse<Ticket[]> {}
export interface TicketViewModelListResult extends StandardApiResponse<TicketViewModel[]> {}
export interface Int32Result extends StandardApiResponse<number> {}
export interface ChurchImageViewModelResult extends StandardApiResponse<ChurchImageViewModel> {}
export interface ChurchImageResponseViewModelListResult extends StandardApiResponse<ChurchImageResponseViewModel[]> {}

// Response interfaces matching API exactly
export interface GetHomePageResponse extends TicketListResult {}
export interface CreateOrUpdateChurchDetailsResponse extends TicketListResult {}
export interface CreateOrUpdateServiceScheduleDetailsResponse extends TicketViewModelListResult {}
export interface GetAllServiceSchedulesResponse extends TicketViewModelListResult {}
export interface GetServiceScheduleResponse extends TicketViewModelListResult {}
export interface DeleteServiceScheduleResponse extends TicketViewModelListResult {}
export interface CreateOrUpdateChurchdayDetailsResponse extends TicketViewModelListResult {}
export interface GetAllChurchdaysResponse extends TicketViewModelListResult {}
export interface DeleteChurchDayResponse extends TicketViewModelListResult {}
export interface CreateChurchImageResponse extends Int32Result {}
export interface UpdateChurchImageResponse extends ChurchImageViewModelResult {}
export interface GetChurchImagesResponse extends ChurchImageResponseViewModelListResult {}
export interface GetChurchImageResponse extends ChurchImageViewModelResult {}
export interface DeleteChurchImageResponse extends TicketViewModelListResult {}