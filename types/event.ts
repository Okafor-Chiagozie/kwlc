// Event-related interfaces and types

export interface DateObject {
  year: number;
  month: number;
  day: number;
  dayOfWeek: "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
}

export interface TimeObject {
  hour: number;
  minute: number;
}

export interface DetailedTimeObject extends TimeObject {
  second: number;
  millisecond: number;
  microsecond: number;
  nanosecond: number;
  ticks: number;
}

export interface Event {
  id: number;
  name: string;
  date: string;
  startTime: string;
  closeTime: string;
  branchId: number;
  eventTypeId: number;
  fee: number;
  maxAttendance: number;
  description: string;
  location: string;
  address: string;
  isDeleted: boolean;
  eventType: string;
  imageUrl: string;
  price: string;
  attendanceCount: number;
  attendees: string;
  dateDeleted: string;
}

export interface Speaker {
  id: number;
  name: string;
  eventId: number;
  file: string;
  imageUrl: string;
  imageName: string;
  description: string;
  speakerRoleId: "MainSpeaker" | string;
  speakerRole: string;
}

export interface EventSchedule {
  id: number;
  eventId: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
}

export interface DetailedEventSchedule {
  id: number;
  dateCreated: string;
  lastModified: string;
  name: string;
  description: string;
  startTime: DetailedTimeObject;
  endTime: DetailedTimeObject;
  eventId: number;
}

export interface EventImage {
  id: number;
  eventId: number;
  file: string;
  imageCategoryId: "CarouselImage" | "PreviewImage" | "GalleryImage" | string;
  imageUrl: string;
  imageName: string;
  imageTitle: string;
}

export interface EventType {
  id: number;
  name: string;
}

export interface DetailedEvent {
  id: number;
  name: string;
  description: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  closeTime: string;
  eventTypeId: number;
  branchId: number;
  price: string;
  carouselImages: string[];
  previewImages: string[];
  galleryImages: string[];
  speakers: Speaker[];
  schedule: EventSchedule[];
}

// Request interfaces
export interface SearchEventRequest {
  pageSize: number;
  pageNumber: number;
  searchParams?: Record<string, string>;
}

export interface CreateOrUpdateEventRequest {
  eventId: number | null;
  name: string;
  date: DateObject;
  startTime: TimeObject;
  closeTime: TimeObject;
  branchId: number;
  eventTypeId: number;
  fee: number;
  maxAttendance: number;
  description: string;
  location: string;
  address: string;
}

export interface AddOrUpdateEventSpeakerRequest {
  Id: number;
  Name: string;
  EventId: number;
  ImageUrl: string;
  ImageName: string;
  Description: string;
  SpeakerRoleId: "MainSpeaker" | string;
  File?: File;
}

export interface CreateOrUpdateEventImageRequest {
  id: number | null;
  eventId: number;
  file: string;
  imageCategoryId: "CarouselImage" | "PreviewImage" | "GalleryImage" | string;
}

export interface CreateOrUpdateEventScheduleRequest {
  id: number | null;
  eventId: number;
  name: string;
  description: string;
  startTime: TimeObject;
  endTime: TimeObject;
}

export interface CreateOrUpdateEventTypeRequest {
  Id: number | null;
  Name: string;
}

// Response interfaces
export interface SearchEventResponse extends StandardApiResponse<Event[]> {
  totalCount: number;
  totalPages: number;
}

export interface CreateOrUpdateEventResponse {
  id: number | null;
  name: string;
  date: string;
  startTime: string;
  closeTime: string;
  branchId: number;
  eventTypeId: number;
  fee: number;
  maxAttendance: number;
  description: string;
  location: string;
  address: string;
  isDeleted: boolean;
  eventType: string;
  imageUrl: string;
  price: string;
  attendanceCount: number;
  attendees: string;
  dateDeleted: string;
}

export interface GetEventDetailResponse extends StandardApiResponse<Event[]> {}

export interface GetEventResponse extends StandardApiResponse<DetailedEvent[]> {}

export interface UpcomingEventsResponse extends Array<Event> {}

export interface FeaturedEventResponse extends Array<Event> {}

export interface UpdateAttendeesResponse extends StandardApiResponse<Event[]> {}

export interface DeleteEventResponse extends StandardApiResponse<number> {}

export interface AddOrUpdateEventSpeakerResponse extends StandardApiResponse<number> {}

export interface GetEventSpeakerResponse extends StandardApiResponse<Speaker[]> {}

export interface GetEventSpeakersResponse extends StandardApiResponse<Event> {
  totalCount: number;
  totalPages: number;
}

export interface DeleteEventSpeakerResponse extends StandardApiResponse<number> {}

export interface CreateOrUpdateEventImageResponse extends StandardApiResponse<EventImage> {}

export interface GetEventImageResponse extends StandardApiResponse<EventImage[]> {}

export interface DeleteEventImageResponse extends StandardApiResponse<number> {}

export interface CreateOrUpdateEventScheduleResponse extends StandardApiResponse<DetailedEventSchedule> {}

export interface GetEventSchedulesResponse extends StandardApiResponse<Event> {
  totalCount: number;
  totalPages: number;
}

export interface GetEventScheduleResponse extends StandardApiResponse<EventSchedule[]> {}

export interface DeleteEventScheduleResponse extends StandardApiResponse<number> {}

export interface CreateOrUpdateEventTypeResponse extends StandardApiResponse<number> {}

export interface GetEventTypesResponse extends StandardApiResponse<EventType> {}

export interface DeleteEventTypeResponse extends StandardApiResponse<number> {}

// Re-export common interfaces from user types
export interface ApiError {
  field: string;
  description: string;
}

export interface StandardApiResponse<T = any> {
  data: T;
  isSuccessful: boolean;
  errors?: ApiError[];
  responseMessage: string;
  responseCode: string;
}