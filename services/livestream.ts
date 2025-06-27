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

export const getLivestreamUrl = async (): Promise<GetLivestreamUrlResponse> => {
  const response = await api.get<GetLivestreamUrlResponse>(
    '/api/v1/Livestream/GetLivestreamUrl'
  );
  return response.data;
};

export const getCompletedStreams = async (
  payload: GetCompletedStreamsRequest
): Promise<GetCompletedStreamsResponse> => {
  const response = await api.post<GetCompletedStreamsResponse>(
    '/api/v1/Livestream/GetCompletedStreams',
    payload
  );
  return response.data;
};

export const getUpcomingStreams = async (
  payload: GetUpcomingStreamsRequest
): Promise<GetUpcomingStreamsResponse> => {
  const response = await api.post<GetUpcomingStreamsResponse>(
    '/api/v1/Livestream/GetUpcomingStreams',
    payload
  );
  return response.data;
};

export const getAllAvailableStreams = async (
  payload: GetAllAvailableStreamsRequest
): Promise<GetAllAvailableStreamsResponse> => {
  const response = await api.post<GetAllAvailableStreamsResponse>(
    '/api/v1/Livestream/GetAllAvailableStreams',
    payload
  );
  return response.data;
};

export const getStreamDetailsByURL = async (
  url: string
): Promise<GetStreamDetailsByURLResponse> => {
  const response = await api.get<GetStreamDetailsByURLResponse>(
    `/api/v1/Livestream/GetStreamDetailsByURL?url=${encodeURIComponent(url)}`
  );
  return response.data;
};

export const getStreamDetailsById = async (
  videoId: string
): Promise<GetStreamDetailsByIdResponse> => {
  const response = await api.get<GetStreamDetailsByIdResponse>(
    `/api/v1/Livestream/GetStreamDetailsById?videoId=${encodeURIComponent(videoId)}`
  );
  return response.data;
};

export const deleteStream = async (
  id: number
): Promise<DeleteStreamResponse> => {
  const response = await api.delete<DeleteStreamResponse>(
    `/api/v1/Livestream/DeleteStream?id=${id}`
  );
  return response.data;
};