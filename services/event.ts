import api from '@/lib/axios';
import {
  SearchEventRequest,
  SearchEventResponse,
  CreateOrUpdateEventRequest,
  CreateOrUpdateEventResponse,
  GetEventDetailResponse,
  GetEventResponse,
  UpcomingEventsResponse,
  FeaturedEventResponse,
  UpdateAttendeesResponse,
  DeleteEventResponse,
  AddOrUpdateEventSpeakerRequest,
  AddOrUpdateEventSpeakerResponse,
  GetEventSpeakerResponse,
  GetEventSpeakersResponse,
  DeleteEventSpeakerResponse,
  CreateOrUpdateEventImageRequest,
  UpdateEventImageRequest,
  CreateOrUpdateEventImageResponse,
  UpdateEventImageResponse,
  GetEventImagesResponse,
  GetEventImageResponse,
  DeleteEventImageResponse,
  CreateOrUpdateEventScheduleRequest,
  CreateOrUpdateEventScheduleResponse,
  GetEventSchedulesResponse,
  GetEventScheduleResponse,
  DeleteEventScheduleResponse,
  CreateOrUpdateEventTypeRequest,
  CreateOrUpdateEventTypeResponse,
  GetEventTypesResponse,
  DeleteEventTypeResponse
} from '@/types/event';

const BASE_URL = '/api/v1/Event';

// Event Search and CRUD operations
export const searchEvent = async (
  payload: SearchEventRequest
): Promise<SearchEventResponse> => {
  const response = await api.post<SearchEventResponse>(
    `${BASE_URL}/SearchEvent`,
    payload
  );
  return response.data;
};

export const createOrUpdateEvent = async (
  payload: CreateOrUpdateEventRequest
): Promise<CreateOrUpdateEventResponse> => {
  const response = await api.post<CreateOrUpdateEventResponse>(
    `${BASE_URL}/CreateOrUpdateEvent`,
    payload
  );
  return response.data;
};

export const getEventDetail = async (
  id: number
): Promise<GetEventDetailResponse> => {
  const response = await api.get<GetEventDetailResponse>(
    `${BASE_URL}/GetEventDetail?id=${id}`
  );
  return response.data;
};

export const getEvent = async (
  id: number
): Promise<GetEventResponse> => {
  const response = await api.get<GetEventResponse>(
    `${BASE_URL}/GetEvent?id=${id}`
  );
  return response.data;
};

export const getUpcomingEvents = async (): Promise<UpcomingEventsResponse> => {
  const response = await api.get<UpcomingEventsResponse>(
    `${BASE_URL}/UpcomingEvents`
  );
  return response.data;
};

export const getFeaturedEvent = async (): Promise<FeaturedEventResponse> => {
  const response = await api.get<FeaturedEventResponse>(
    `${BASE_URL}/FeaturedEvent`
  );
  return response.data;
};

export const updateAttendees = async (
  eventId: number
): Promise<UpdateAttendeesResponse> => {
  const response = await api.get<UpdateAttendeesResponse>(
    `${BASE_URL}/updateattendees?eventId=${eventId}`
  );
  return response.data;
};

export const deleteEvent = async (
  id: number
): Promise<DeleteEventResponse> => {
  const response = await api.delete<DeleteEventResponse>(
    `${BASE_URL}/DeleteEvent?id=${id}`
  );
  return response.data;
};

// Event Speaker operations
export const addOrUpdateEventSpeaker = async (
  payload: AddOrUpdateEventSpeakerRequest
): Promise<AddOrUpdateEventSpeakerResponse> => {
  // Create FormData for multipart/form-data as specified in API
  const formData = new FormData();
  
  // Add file if provided
  if (payload.File) {
    formData.append('File', payload.File);
  }

  const response = await api.post<AddOrUpdateEventSpeakerResponse>(
    `${BASE_URL}/AddOrUpdateEventSpeaker?Id=${payload.Id}&Name=${encodeURIComponent(payload.Name)}&EventId=${payload.EventId}&ImageUrl=${encodeURIComponent(payload.ImageUrl)}&ImageName=${encodeURIComponent(payload.ImageName)}&Description=${encodeURIComponent(payload.Description)}&SpeakerRoleId=${payload.SpeakerRoleId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const getEventSpeaker = async (
  eventId: number,
  speakerId: number
): Promise<GetEventSpeakerResponse> => {
  const response = await api.get<GetEventSpeakerResponse>(
    `${BASE_URL}/GetEventSpeaker?eventId=${eventId}&speakerId=${speakerId}`
  );
  return response.data;
};

export const getEventSpeakers = async (
  eventId: number,
  payload: SearchEventRequest
): Promise<GetEventSpeakersResponse> => {
  // Note: API shows GET with requestBody, which is unusual but following the spec
  const response = await api.get<GetEventSpeakersResponse>(
    `${BASE_URL}/GetEventSpeakers?eventId=${eventId}`,
    {
      data: payload
    }
  );
  return response.data;
};

export const deleteEventSpeaker = async (
  eventId: number,
  speakerId: number
): Promise<DeleteEventSpeakerResponse> => {
  const response = await api.delete<DeleteEventSpeakerResponse>(
    `${BASE_URL}/DeleteEventSpeaker?eventId=${eventId}&speakerid=${speakerId}`
  );
  return response.data;
};

// Event Image operations
export const createOrUpdateEventImage = async (
  payload: CreateOrUpdateEventImageRequest
): Promise<CreateOrUpdateEventImageResponse> => {
  // Create FormData for multipart/form-data (inferred from similar endpoints)
  const formData = new FormData();
  
  // Append files array
  payload.file.forEach((file) => {
    formData.append('file', file);
  });

  const response = await api.post<CreateOrUpdateEventImageResponse>(
    `${BASE_URL}/CreateOrUpdateEventImage?eventId=${payload.eventId}&imageCategoryId=${payload.imageCategoryId}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const updateEventImage = async (
  payload: UpdateEventImageRequest
): Promise<UpdateEventImageResponse> => {
  // Create FormData for multipart/form-data as specified in API
  const formData = new FormData();
  formData.append('file', payload.file);

  const response = await api.put<UpdateEventImageResponse>(
    `${BASE_URL}/UpdateEventImage?Id=${payload.Id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const getEventImages = async (
  eventId: number
): Promise<GetEventImagesResponse> => {
  const response = await api.get<GetEventImagesResponse>(
    `${BASE_URL}/GetEventImages?eventId=${eventId}`
  );
  return response.data;
};

export const getEventImage = async (
  eventId: number,
  imageId: number
): Promise<GetEventImageResponse> => {
  const response = await api.get<GetEventImageResponse>(
    `${BASE_URL}/GetEventImage?eventId=${eventId}&imageId=${imageId}`
  );
  return response.data;
};

export const deleteEventImage = async (
  eventId: number,
  imageId: number
): Promise<DeleteEventImageResponse> => {
  const response = await api.delete<DeleteEventImageResponse>(
    `${BASE_URL}/DeleteEventImage?eventId=${eventId}&imageId=${imageId}`
  );
  return response.data;
};

// Event Schedule operations
export const createOrUpdateEventSchedule = async (
  payload: CreateOrUpdateEventScheduleRequest
): Promise<CreateOrUpdateEventScheduleResponse> => {
  const response = await api.post<CreateOrUpdateEventScheduleResponse>(
    `${BASE_URL}/CreateOrUpdateEventSchedule`,
    payload
  );
  return response.data;
};

export const getEventSchedules = async (
  eventId: number,
  payload: SearchEventRequest
): Promise<GetEventSchedulesResponse> => {
  // Note: API shows GET with requestBody, which is unusual but following the spec
  const response = await api.get<GetEventSchedulesResponse>(
    `${BASE_URL}/GetEventSchedules?eventId=${eventId}`,
    {
      data: payload
    }
  );
  return response.data;
};

export const getEventSchedule = async (
  eventId: number,
  scheduleId: number
): Promise<GetEventScheduleResponse> => {
  const response = await api.get<GetEventScheduleResponse>(
    `${BASE_URL}/GetEventSchedule?eventId=${eventId}&scheduleId=${scheduleId}`
  );
  return response.data;
};

export const deleteEventSchedule = async (
  eventId: number,
  scheduleId: number
): Promise<DeleteEventScheduleResponse> => {
  const response = await api.delete<DeleteEventScheduleResponse>(
    `${BASE_URL}/DeleteEventSchedule?eventId=${eventId}&scheduleId=${scheduleId}`
  );
  return response.data;
};

// Event Type operations
export const createOrUpdateEventType = async (
  payload: CreateOrUpdateEventTypeRequest
): Promise<CreateOrUpdateEventTypeResponse> => {
  const response = await api.post<CreateOrUpdateEventTypeResponse>(
    `${BASE_URL}/CreateOrUpdateEventType`,
    payload
  );
  return response.data;
};

export const getEventTypes = async (): Promise<GetEventTypesResponse> => {
  const response = await api.get<GetEventTypesResponse>(
    `${BASE_URL}/GetEventTypes`
  );
  return response.data;
};

export const deleteEventType = async (
  typeId: number
): Promise<DeleteEventTypeResponse> => {
  const response = await api.delete<DeleteEventTypeResponse>(
    `${BASE_URL}/DeleteEventType?typeId=${typeId}`
  );
  return response.data;
};