export interface CreateOrUpdateMinisterRequest {
  id: number;
  email: string;
  branchId: number;
  lastName: string;
  biography: string;
  firstName: string;
  phoneNumber: string;
  middleName: string;
  imageFile: string;
  ministerRoleId: string;
}

export interface SearchMinistersRequest {
  pageSize: number;
  pageNumber: number;
  searchParams?: Record<string, string>;
}

export interface Minister {
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
  venue: string;
  isDeleted: boolean;
  eventType: string;
  imageUrl: string;
  price: string;
  attendanceCount: number;
  attendees: string;
  dateDeleted: string;
}

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
  totalCount?: number;
  totalPages?: number;
}

export interface CreateOrUpdateMinisterResponse extends Minister {}

export interface SearchMinistersResponse extends StandardApiResponse<Minister[]> {
  totalCount: number;
  totalPages: number;
}

export interface GetAllMinistersResponse extends StandardApiResponse<Minister[]> {}

export interface DeleteMinisterResponse extends StandardApiResponse<Minister[]> {}