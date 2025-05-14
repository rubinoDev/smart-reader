import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { Book, BookStatus } from '../types';

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchUserBooks: (userId: string) => Promise<void>;
  addBook: (book: Omit<Book, 'id'>) => Promise<Book>;
  updateBook: (id: string, bookData: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  updateBookStatus: (id: string, status: BookStatus) => Promise<void>;
  updateBookRating: (id: string, rating: number) => Promise<void>;
  getBooksByStatus: (status: BookStatus) => Book[];
  getTopRatedBooks: (limit?: number) => Book[];
}

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  loading: false,
  error: null,

  fetchUserBooks: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const q = query(
        collection(db, 'books'),
        where('userId', '==', userId),
        orderBy('title')
      );
      
      const querySnapshot = await getDocs(q);
      const books: Book[] = [];
      
      querySnapshot.forEach((doc) => {
        books.push({ id: doc.id, ...doc.data() } as Book);
      });
      
      set({ books, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error fetching books:', error);
    }
  },

  addBook: async (bookData: Omit<Book, 'id'>) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'books'), bookData);
      const newBook = { id: docRef.id, ...bookData } as Book;
      
      set((state) => ({
        books: [...state.books, newBook],
        loading: false,
      }));
      
      return newBook;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error adding book:', error);
      throw error;
    }
  },

  updateBook: async (id: string, bookData: Partial<Book>) => {
    try {
      set({ loading: true, error: null });
      const bookRef = doc(db, 'books', id);
      await updateDoc(bookRef, bookData);
      
      set((state) => ({
        books: state.books.map((book) => 
          book.id === id ? { ...book, ...bookData } : book
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error updating book:', error);
      throw error;
    }
  },

  deleteBook: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'books', id));
      
      set((state) => ({
        books: state.books.filter((book) => book.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  updateBookStatus: async (id: string, status: BookStatus) => {
    try {
      const { updateBook } = get();
      await updateBook(id, { status });
    } catch (error) {
      console.error('Error updating book status:', error);
      throw error;
    }
  },

  updateBookRating: async (id: string, rating: number) => {
    try {
      const { updateBook } = get();
      await updateBook(id, { rating });
    } catch (error) {
      console.error('Error updating book rating:', error);
      throw error;
    }
  },

  getBooksByStatus: (status: BookStatus) => {
    return get().books.filter((book) => book.status === status);
  },

  getTopRatedBooks: (limit = 10) => {
    return [...get().books]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },
}));
