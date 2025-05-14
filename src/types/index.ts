// User type
export interface User {
  id: string;
  name: string;
  email: string;
}

// Book status type
export type BookStatus = 'desired' | 'inProgress' | 'read';

// Book type
export interface Book {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  userId: string;
  rating: number;
}

// Review type
export interface Review {
  id: string;
  bookId: string;
  userId: string;
  text: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}
