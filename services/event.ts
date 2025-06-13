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
  CreateOrUpdateEventImageResponse,
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

// Event Search and CRUD operations
export const searchEvents = async (
  payload: SearchEventRequest
): Promise<SearchEventResponse> => {
  const response = await api.post<SearchEventResponse>(
    '/api/v1/Event/SearchEvent',
    payload
  );
  return response.data;
};

export const createOrUpdateEvent = async (
  payload: CreateOrUpdateEventRequest
): Promise<CreateOrUpdateEventResponse> => {
  const response = await api.post<CreateOrUpdateEventResponse>(
    '/api/v1/Event/CreateOrUpdateEvent',
    payload
  );
  return response.data;
};

export const getEventDetail = async (
  id: number
): Promise<GetEventDetailResponse> => {
  const response = await api.get<GetEventDetailResponse>(
    `/api/v1/Event/GetEventDetail?id=${id}`
  );
  return response.data;
};

export const getEvent = async (
  id: number
): Promise<GetEventResponse> => {
  const response = await api.get<GetEventResponse>(
    `/api/v1/Event/GetEvent?id=${id}`
  );
  return response.data;
};

export const getUpcomingEvents = async (): Promise<UpcomingEventsResponse> => {
  const response = await api.get<UpcomingEventsResponse>(
    '/api/v1/Event/UpcomingEvents'
  );
  return response.data;
};

export const getFeaturedEvents = async (): Promise<FeaturedEventResponse> => {
  const response = await api.get<FeaturedEventResponse>(
    '/api/v1/Event/FeaturedEvent'
  );
  return response.data;
};

export const updateAttendees = async (
  eventId: number
): Promise<UpdateAttendeesResponse> => {
  const response = await api.get<UpdateAttendeesResponse>(
    `/api/v1/Event/updateattendees?eventId=${eventId}`
  );
  return response.data;
};

export const deleteEvent = async (
  id: number
): Promise<DeleteEventResponse> => {
  const response = await api.delete<DeleteEventResponse>(
    `/api/v1/Event/DeleteEvent?id=${id}`
  );
  return response.data;
};

// Event Speaker operations
export const addOrUpdateEventSpeaker = async (
  payload: AddOrUpdateEventSpeakerRequest
): Promise<AddOrUpdateEventSpeakerResponse> => {
  const formData = new FormData();
  
  // Add file if provided
  if (payload.File) {
    formData.append('File', payload.File);
  }

  const response = await api.post<AddOrUpdateEventSpeakerResponse>(
    `/api/v1/Event/AddOrUpdateEventSpeaker?Id=${payload.Id}&Name=${encodeURIComponent(payload.Name)}&EventId=${payload.EventId}&ImageUrl=${encodeURIComponent(payload.ImageUrl)}&ImageName=${encodeURIComponent(payload.ImageName)}&Description=${encodeURIComponent(payload.Description)}&SpeakerRoleId=${payload.SpeakerRoleId}`,
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
    `/api/v1/Event/GetEventSpeaker?eventId=${eventId}&speakerId=${speakerId}`
  );
  return response.data;
};

export const getEventSpeakers = async (
  eventId: number,
  payload: SearchEventRequest
): Promise<GetEventSpeakersResponse> => {
  const response = await api.delete<GetEventSpeakersResponse>(
    `/api/v1/Event/GetEventSpeakers?eventId=${eventId}`,
    { data: payload }
  );
  return response.data;
};

export const deleteEventSpeaker = async (
  eventId: number,
  speakerId: number
): Promise<DeleteEventSpeakerResponse> => {
  const response = await api.delete<DeleteEventSpeakerResponse>(
    `/api/v1/Event/DeleteEventSpeaker?eventId=${eventId}&speakerid=${speakerId}`
  );
  return response.data;
};

// Event Image operations
export const createOrUpdateEventImage = async (
  payload: CreateOrUpdateEventImageRequest
): Promise<CreateOrUpdateEventImageResponse> => {
  const response = await api.post<CreateOrUpdateEventImageResponse>(
    '/api/v1/Event/CreateOrUpdateEventImage',
    payload
  );
  return response.data;
};

export const getEventImage = async (
  eventId: number,
  imageId: number
): Promise<GetEventImageResponse> => {
  const response = await api.get<GetEventImageResponse>(
    `/api/v1/Event/GetEventImage?eventId=${eventId}&imageId=${imageId}`
  );
  return response.data;
};

export const deleteEventImage = async (
  eventId: number,
  imageId: number
): Promise<DeleteEventImageResponse> => {
  const response = await api.delete<DeleteEventImageResponse>(
    `/api/v1/Event/DeleteEventImage?eventId=${eventId}&imageId=${imageId}`
  );
  return response.data;
};

// Event Schedule operations
export const createOrUpdateEventSchedule = async (
  payload: CreateOrUpdateEventScheduleRequest
): Promise<CreateOrUpdateEventScheduleResponse> => {
  const response = await api.post<CreateOrUpdateEventScheduleResponse>(
    '/api/v1/Event/CreateOrUpdateEventSchedule',
    payload
  );
  return response.data;
};

export const getEventSchedules = async (
  eventId: number,
  payload: SearchEventRequest
): Promise<GetEventSchedulesResponse> => {
  const response = await api.get<GetEventSchedulesResponse>(
    `/api/v1/Event/GetEventSchedules?eventId=${eventId}`,
    { data: payload }
  );
  return response.data;
};

export const getEventSchedule = async (
  eventId: number,
  scheduleId: number
): Promise<GetEventScheduleResponse> => {
  const response = await api.get<GetEventScheduleResponse>(
    `/api/v1/Event/GetEventSchedule?eventId=${eventId}&scheduleId=${scheduleId}`
  );
  return response.data;
};

export const deleteEventSchedule = async (
  eventId: number,
  scheduleId: number
): Promise<DeleteEventScheduleResponse> => {
  const response = await api.delete<DeleteEventScheduleResponse>(
    `/api/v1/Event/DeleteEventSchedule?eventId=${eventId}&scheduleId=${scheduleId}`
  );
  return response.data;
};

// Event Type operations
export const createOrUpdateEventType = async (
  payload: CreateOrUpdateEventTypeRequest
): Promise<CreateOrUpdateEventTypeResponse> => {
  const response = await api.post<CreateOrUpdateEventTypeResponse>(
    `/api/v1/Event/CreateOrUpdateEventType?Id=${payload.Id}&Name=${encodeURIComponent(payload.Name)}`,
    {}
  );
  return response.data;
};

export const getEventTypes = async (): Promise<GetEventTypesResponse> => {
  const response = await api.get<GetEventTypesResponse>(
    '/api/v1/Event/GetEventTypes'
  );
  return response.data;
};

export const deleteEventType = async (
  typeId: number
): Promise<DeleteEventTypeResponse> => {
  const response = await api.delete<DeleteEventTypeResponse>(
    `/api/v1/Event/DeleteEventType?typeId=${typeId}`
  );
  return response.data;
};