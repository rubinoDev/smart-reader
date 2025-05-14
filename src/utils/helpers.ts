import { Book, BookStatus, Review } from '../types';

// Format date to a readable string
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Get count of books by status
export const getBookCountByStatus = (books: Book[], status: BookStatus): number => {
  return books.filter((book) => book.status === status).length;
};

// Get total book count
export const getTotalBookCount = (books: Book[]): number => {
  return books.length;
};

// Calculate average rating for a book from reviews
export const calculateAverageRating = (books: Book[]): number => {
  if (books.length === 0) return 0;
  
  const totalRating = books.reduce((sum, book) => sum + book.rating, 0);
  return totalRating / books.length;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Group books by author
export const groupBooksByAuthor = (books: Book[]): Record<string, Book[]> => {
  return books.reduce((acc, book) => {
    const { author } = book;
    if (!acc[author]) {
      acc[author] = [];
    }
    acc[author].push(book);
    return acc;
  }, {} as Record<string, Book[]>);
};

// Get book status label
export const getStatusLabel = (status: BookStatus): string => {
  const statusMap: Record<BookStatus, string> = {
    desired: 'Para ler',
    inProgress: 'Em andamento',
    read: 'Lido',
  };
  
  return statusMap[status] || status;
};

// Get color for book status
export const getStatusColor = (status: BookStatus): string => {
  const colorMap: Record<BookStatus, string> = {
    desired: 'blue',
    inProgress: 'orange',
    read: 'green',
  };
  
  return colorMap[status] || 'gray';
};

// Convert rating number to array for star display
export const ratingToArray = (rating: number): number[] => {
  return Array.from({ length: 5 }, (_, i) => (i < Math.round(rating) ? 1 : 0));
};

// Check if user has reviewed a book
export const hasUserReviewedBook = (
  reviews: Review[],
  userId: string,
  bookId: string
): boolean => {
  return reviews.some(
    (review) => review.userId === userId && review.bookId === bookId
  );
};

// Get user's review for a book
export const getUserReviewForBook = (
  reviews: Review[],
  userId: string,
  bookId: string
): Review | undefined => {
  return reviews.find(
    (review) => review.userId === userId && review.bookId === bookId
  );
};
