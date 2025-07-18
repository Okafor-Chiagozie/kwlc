import api from '@/lib/axios';
import {
  GetLivestreamUrlResponse,
  GetCompletedStreamsRequest,
  GetCompletedStreamsResponse,
  GetUpcomingStreamsRequest,
  GetUpcomingStreamsResponse,
  GetAllAvailableStreamsRequest,
  GetAllAvailableStreamsResponse,
  GetStreamDetailsByURLResponse,
  GetStreamDetailsByIdResponse,
  DeleteStreamResponse
} from '@/types/livestream';

const BASE_URL = '/api/v1/Livestream';

// Livestream operations
export const getLivestreamUrl = async (): Promise<GetLivestreamUrlResponse> => {
  const response = await api.get<GetLivestreamUrlResponse>(
    `${BASE_URL}/GetLivestreamUrl`
  );
  return response.data;
};

export const getCompletedStreams = async (
  payload: GetCompletedStreamsRequest
): Promise<GetCompletedStreamsResponse> => {
  const response = await api.post<GetCompletedStreamsResponse>(
    `${BASE_URL}/GetCompletedStreams`,
    payload
  );
  return response.data;
};

export const getUpcomingStreams = async (
  payload: GetUpcomingStreamsRequest
): Promise<GetUpcomingStreamsResponse> => {
  const response = await api.post<GetUpcomingStreamsResponse>(
    `${BASE_URL}/GetUpcomingStreams`,
    payload
  );
  return response.data;
};

export const getAllAvailableStreams = async (
  payload: GetAllAvailableStreamsRequest
): Promise<GetAllAvailableStreamsResponse> => {
  const response = await api.post<GetAllAvailableStreamsResponse>(
    `${BASE_URL}/GetAllAvailableStreams`,
    payload
  );
  return response.data;
};

export const getStreamDetailsByURL = async (
  url: string
): Promise<GetStreamDetailsByURLResponse> => {
  const response = await api.get<GetStreamDetailsByURLResponse>(
    `${BASE_URL}/GetStreamDetailsByURL?url=${encodeURIComponent(url)}`
  );
  return response.data;
};

export const getStreamDetailsById = async (
  videoId: string
): Promise<GetStreamDetailsByIdResponse> => {
  const response = await api.get<GetStreamDetailsByIdResponse>(
    `${BASE_URL}/GetStreamDetailsById?videoId=${encodeURIComponent(videoId)}`
  );
  return response.data;
};

export const deleteStream = async (
  id: number
): Promise<DeleteStreamResponse> => {
  const response = await api.delete<DeleteStreamResponse>(
    `${BASE_URL}/DeleteStream?id=${id}`
  );
  return response.data;
};