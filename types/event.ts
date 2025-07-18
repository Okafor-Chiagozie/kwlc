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

export interface PaginatedApiResponse<T = any> extends StandardApiResponse<T> {
  totalCount: number;
  totalPages: number;
}

export interface SearchFilter {
  pageSize: number;
  pageNumber: number;
  searchParams?: Record<string, string>;
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

export enum ImageCategory {
  CarouselImage = "CarouselImage",
  GalleryImages = "GalleryImages",
  PreviewImage = "PreviewImage", 
  ThumbnailImage = "ThumbnailImage",
  Headshots = "Headshots",
  TicketImage = "TicketImage"
}

export enum SpeakerRole {
  MainSpeaker = "MainSpeaker",
  GuestSpeaker = "GuestSpeaker",
  Moderator = "Moderator",
  Other = "Other"
}

// Date and Time interfaces from API
export interface DateOnly {
  year: number;
  month: number;
  day: number;
  dayOfWeek: DayOfWeek;
  dayOfYear: number;
  dayNumber: number;
}

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

// AddEventViewModel from API
export interface AddEventViewModel {
  id?: number | null;
  name: string;
  date: DateOnly;
  startTime: TimeOnly;
  closeTime: TimeOnly;
  branchId?: number | null;
  eventTypeId: number;
  fee?: number | null;
  maxAttendance?: number | null;
  description: string;
  location: string;
  address: string;
}

// EventViewModel from API
export interface EventViewModel {
  id: number;
  name: string;
  date: string;
  startTime: string;
  closeTime: string;
  branchId?: number | null;
  eventTypeId: number;
  fee?: number | null;
  maxAttendance?: number | null;
  description: string;
  location: string;
  address: string;
  venue: string;
  isDeleted: boolean;
  eventType: string;
  imageUrl: string;
  price: string;
  attendanceCount: number;
  attendees: string;
  dateDeleted?: string;
}

// EventResponseViewModel from API
export interface EventResponseViewModel {
  id: number;
  name: string;
  branchName: string;
  description: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  closeTime: string;
  eventTypeId: number;
  branchId?: number | null;
  price: string;
  carouselImages: string[];
  previewImages: string[];
  galleryImages: string[];
  speakers: EventSpeakerViewModel[];
  schedule: EventScheduleViewModel[];
}

// EventSpeakerViewModel from API
export interface EventSpeakerViewModel {
  id?: number | null;
  name: string;
  eventId?: number | null;
  file?: File | null;
  imageUrl: string;
  imageName: string;
  description: string;
  speakerRoleId: SpeakerRole;
  speakerRole: string;
}

// AddEventImageViewModel from API
export interface AddEventImageViewModel {
  eventId: number;
  file: File[];
  imageCategoryId: ImageCategory;
}

// EventImageViewModel from API
export interface EventImageViewModel {
  eventId: number;
  file: File[];
  imageCategoryId: ImageCategory;
  imageUrl: string;
  imageName: string;
}

// AddEventScheduleViewModel from API
export interface AddEventScheduleViewModel {
  id?: number | null;
  eventId: number;
  name: string;
  description: string;
  startTime: TimeOnly;
  endTime: TimeOnly;
}

// EventSchedule from API (detailed)
export interface EventSchedule {
  id: number;
  dateCreated: string;
  lastModified: string;
  name: string;
  description: string;
  startTime: TimeOnly;
  endTime: TimeOnly;
  eventId: number;
}

// EventScheduleViewModel from API
export interface EventScheduleViewModel {
  id?: number | null;
  eventId: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}

// AddEventTypeViewModel from API
export interface AddEventTypeViewModel {
  id?: number | null;
  name: string;
}

// Request types
export type SearchEventRequest = SearchFilter;
export type CreateOrUpdateEventRequest = AddEventViewModel;
export type AddOrUpdateEventSpeakerRequest = {
  Id: number;
  Name: string;
  EventId: number;
  ImageUrl: string;
  ImageName: string;
  Description: string;
  SpeakerRoleId: SpeakerRole;
  File?: File;
};
export type CreateOrUpdateEventImageRequest = AddEventImageViewModel;
export type UpdateEventImageRequest = {
  Id: number;
  file: File;
};
export type CreateOrUpdateEventScheduleRequest = AddEventScheduleViewModel;
export type CreateOrUpdateEventTypeRequest = AddEventTypeViewModel;

// Response types based on API documentation
export interface Int32Result extends StandardApiResponse<number> {}
export interface EventViewModelListPaginationResult extends PaginatedApiResponse<EventViewModel[]> {}
export interface EventViewModelListResult extends StandardApiResponse<EventViewModel[]> {}
export interface EventResponseViewModelListResult extends StandardApiResponse<EventResponseViewModel[]> {}
export interface EventSpeakerViewModelListResult extends StandardApiResponse<EventSpeakerViewModel[]> {}
export interface EventImageViewModelResult extends StandardApiResponse<EventImageViewModel> {}
export interface EventImageViewModelListResult extends StandardApiResponse<EventImageViewModel[]> {}
export interface EventScheduleResult extends StandardApiResponse<EventSchedule> {}
export interface EventScheduleViewModelListResult extends StandardApiResponse<EventScheduleViewModel[]> {}
export interface EventViewModelPaginationResult extends PaginatedApiResponse<EventViewModel> {}
export interface AddEventTypeViewModelResult extends StandardApiResponse<AddEventTypeViewModel> {}

// Response interfaces matching API exactly
export interface SearchEventResponse extends EventViewModelListPaginationResult {}
export interface CreateOrUpdateEventResponse extends EventViewModel {}
export interface GetEventDetailResponse extends EventViewModelListResult {}
export interface GetEventResponse extends EventResponseViewModelListResult {}
export type UpcomingEventsResponse = EventViewModel[];
export type FeaturedEventResponse = EventViewModel[];
export interface UpdateAttendeesResponse extends EventViewModelListResult {}
export interface DeleteEventResponse extends Int32Result {}

export interface AddOrUpdateEventSpeakerResponse extends Int32Result {}
export interface GetEventSpeakerResponse extends EventSpeakerViewModelListResult {}
export interface GetEventSpeakersResponse extends EventViewModelPaginationResult {}
export interface DeleteEventSpeakerResponse extends Int32Result {}

export interface CreateOrUpdateEventImageResponse extends EventImageViewModelResult {}
export interface UpdateEventImageResponse extends EventImageViewModelResult {}
export interface GetEventImagesResponse extends EventImageViewModelListResult {}
export interface GetEventImageResponse extends EventImageViewModelResult {}
export interface DeleteEventImageResponse extends Int32Result {}

export interface CreateOrUpdateEventScheduleResponse extends EventScheduleResult {}
export interface GetEventSchedulesResponse extends EventViewModelPaginationResult {}
export interface GetEventScheduleResponse extends EventScheduleViewModelListResult {}
export interface DeleteEventScheduleResponse extends Int32Result {}

export interface CreateOrUpdateEventTypeResponse extends Int32Result {}
export interface GetEventTypesResponse extends AddEventTypeViewModelResult {}
export interface DeleteEventTypeResponse extends Int32Result {}