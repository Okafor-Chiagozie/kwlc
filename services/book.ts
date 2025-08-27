import api from '@/lib/axios';
import {
  AddBookRequest,
  AddBookResponse,
  UpdateBookRequest,
  UpdateBookResponse,
  GetBooksRequest,
  GetBooksResponse,
  GetBookResponse,
  GetBookSummaryResponse,
  DeleteBookResponse
} from '@/types/book';

const BASE_URL = '/api/v1/Book';

// Book CRUD operations
export const addBook = async (
  payload: AddBookRequest
): Promise<AddBookResponse> => {
  // Create FormData for multipart/form-data as specified in API
  const formData = new FormData();
  
  formData.append('Title', payload.title);
  formData.append('Description', payload.description);
  formData.append('Author', payload.author);
  formData.append('Price', payload.price.toString());
  formData.append('CategoryId', payload.categoryId);
  
  if (payload.file) {
    formData.append('File', payload.file);
  }
  
  if (payload.image) {
    formData.append('Image', payload.image);
  }

  const response = await api.post<AddBookResponse>(
    `${BASE_URL}/AddBook`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const updateBook = async (
  payload: UpdateBookRequest
): Promise<UpdateBookResponse> => {
  // Create FormData for multipart/form-data as specified in API
  const formData = new FormData();
  
  formData.append('Id', payload.id.toString());
  formData.append('Title', payload.title);
  formData.append('Description', payload.description);
  formData.append('Author', payload.author);
  formData.append('Price', payload.price.toString());
  formData.append('BookCategoryId', payload.bookCategoryId);
  
  if (payload.file) {
    formData.append('File', payload.file);
  }
  
  if (payload.image) {
    formData.append('Image', payload.image);
  }

  const response = await api.put<UpdateBookResponse>(
    `${BASE_URL}/UpdateBook`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const getBooks = async (
  payload: GetBooksRequest
): Promise<GetBooksResponse> => {
  const response = await api.post<GetBooksResponse>(
    `${BASE_URL}/GetBooks`,
    payload
  );
  return response.data;
};

export const getBook = async (
  id: number
): Promise<GetBookResponse> => {
  const response = await api.get<GetBookResponse>(
    `${BASE_URL}/GetBook?Id=${id}`
  );
  return response.data;
};

export const getBookSummary = async (): Promise<GetBookSummaryResponse> => {
  const response = await api.get<GetBookSummaryResponse>(
    `${BASE_URL}/GetBookSummary`
  );
  return response.data;
};

export const deleteBook = async (
  id: number
): Promise<DeleteBookResponse> => {
  const response = await api.delete<DeleteBookResponse>(
    `${BASE_URL}/DeleteBook?Id=${id}`
  );
  return response.data;
};
