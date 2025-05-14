import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where
} from 'firebase/firestore';
import { db } from '../services/firebase';
import { Review } from '../types';

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
  fetchBookReviews: (bookId: string) => Promise<void>;
  fetchUserReviews: (userId: string) => Promise<void>;
  addReview: (review: Omit<Review, 'id'>) => Promise<Review>;
  updateReview: (id: string, text: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  getReviewById: (id: string) => Review | undefined;
  getReviewsByBookId: (bookId: string) => Review[];
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchBookReviews: async (bookId: string) => {
    try {
      set({ loading: true, error: null });
      // Remove orderBy to avoid potential index issues
      const q = query(
        collection(db, 'reviews'),
        where('bookId', '==', bookId)
      );
      
      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() } as Review);
      });
      
      set({ reviews, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error fetching reviews:', error);
    }
  },

  fetchUserReviews: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const q = query(
        collection(db, 'reviews'),
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const reviews: Review[] = [];
      
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() } as Review);
      });
      
      set({ reviews, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error fetching user reviews:', error);
    }
  },

  addReview: async (reviewData: Omit<Review, 'id'>) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'reviews'), reviewData);
      const newReview = { id: docRef.id, ...reviewData } as Review;
      
      set((state) => ({
        reviews: [...state.reviews, newReview],
        loading: false,
      }));
      
      return newReview;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error adding review:', error);
      throw error;
    }
  },

  updateReview: async (id: string, text: string) => {
    try {
      set({ loading: true, error: null });
      const reviewRef = doc(db, 'reviews', id);
      await updateDoc(reviewRef, { text });
      
      set((state) => ({
        reviews: state.reviews.map((review) => 
          review.id === id ? { ...review, text } : review
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error updating review:', error);
      throw error;
    }
  },

  deleteReview: async (id: string) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'reviews', id));
      
      set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  getReviewById: (id: string) => {
    return get().reviews.find((review) => review.id === id);
  },

  getReviewsByBookId: (bookId: string) => {
    return get().reviews.filter((review) => review.bookId === bookId);
  },
}));
