import api from '@/lib/axios';
import axios from 'axios';
import {
  GetLivestreamUrlResponse,
  GetCompletedStreamsRequest,
  GetCompletedStreamsResponse,
  GetUpcomingStreamsRequest,
  GetUpcomingStreamsResponse,
  GetAllAvailableStreamsRequest,
  GetAllAvailableStreamsResponse,
  GetNormalUploadsRequest,
  GetNormalUploadsResponse,
  GetStreamDetailsByURLRequest,
  GetStreamDetailsByURLResponse,
  GetStreamDetailsByIdRequest,
  GetStreamDetailsByIdResponse,
  DeleteStreamRequest,
  DeleteStreamResponse
} from '@/types/livestream';

const BASE_URL = '/api/v1/Livestream';

// Livestream operations matching API documentation exactly
// Note: All endpoints return TicketViewModelListResult due to API design issue

export const getLivestreamUrl = async (): Promise<GetLivestreamUrlResponse> => {
  const response = await api.get<GetLivestreamUrlResponse>(
    `${BASE_URL}/GetLivestreamUrl`
  );
  return response.data;
};

export const getCompletedStreams = async (
  payload: GetCompletedStreamsRequest
): Promise<GetCompletedStreamsResponse> => {
  const response = await axios.post<GetCompletedStreamsResponse>(
    `http://musharealestate-001-site4.jtempurl.com/api/v1/Livestream/GetCompletedStreams`,
    payload,
    { headers: { 'Content-Type': 'application/json', accept: 'text/plain' } }
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

export const getNormalUploads = async (
  payload: GetNormalUploadsRequest
): Promise<GetNormalUploadsResponse> => {
  const response = await axios.post<GetNormalUploadsResponse>(
    `http://musharealestate-001-site4.jtempurl.com/api/v1/Livestream/GetNormalUploadsAsync`,
    payload,
    { headers: { 'Content-Type': 'application/json', accept: 'text/plain' } }
  );
  return response.data;
};

export const getAllAvailableStreams = async (
  payload: GetAllAvailableStreamsRequest
): Promise<GetAllAvailableStreamsResponse> => {
  // Use POST with exact same structure as GetCompletedStreams (which works)
  const requestPayload = {
    pageSize: payload.pageSize,
    pageNumber: payload.pageNumber,
    searchParams: payload.searchParams || {}
  };
  
  const response = await api.post<GetAllAvailableStreamsResponse>(
    `${BASE_URL}/GetAllAvailableStreams`,
    requestPayload
  );
  return response.data;
};

export const getStreamDetailsByURL = async (
  url: GetStreamDetailsByURLRequest
): Promise<GetStreamDetailsByURLResponse> => {
  const response = await api.get<GetStreamDetailsByURLResponse>(
    `${BASE_URL}/GetStreamDetailsByURL?url=${encodeURIComponent(url)}`
  );
  return response.data;
};

export const getStreamDetailsById = async (
  videoId: GetStreamDetailsByIdRequest
): Promise<GetStreamDetailsByIdResponse> => {
  const response = await api.get<GetStreamDetailsByIdResponse>(
    `${BASE_URL}/GetStreamDetailsById?videoId=${encodeURIComponent(videoId)}`
  );
  return response.data;
};

export const deleteStream = async (
  id: DeleteStreamRequest
): Promise<DeleteStreamResponse> => {
  const response = await api.delete<DeleteStreamResponse>(
    `${BASE_URL}/DeleteStream?id=${id}`
  );
  return response.data;
};
