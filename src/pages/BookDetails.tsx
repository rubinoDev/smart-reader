import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Rating, 
  Divider, 
  TextField,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuthStore } from '../context/authStore';
import { useBookStore } from '../context/bookStore';
import { useReviewStore } from '../context/reviewStore';
import { getStatusLabel } from '../utils/helpers';
import { Review } from '../types';

const BookDetails = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { books, loading: booksLoading } = useBookStore();
  const { 
    reviews, 
    loading: reviewsLoading, 
    addReview, 
    updateReview, 
    deleteReview 
  } = useReviewStore();
  
  const [reviewText, setReviewText] = useState('');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Find the book from the books array
  const book = books.find(b => b.id === bookId);
  
  // Find the user's review for this book
  const userReview = user ? reviews.find(review => review.userId === user.id) : null;

  // Fetch book reviews when component mounts or bookId changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (bookId) {
        console.log('Fetching reviews for book:', bookId);
        try {
          // Use getState to ensure we're calling the latest function
          const { fetchBookReviews } = useReviewStore.getState();
          await fetchBookReviews(bookId);
          
          // Log the reviews after fetching to verify they were loaded
          const currentReviews = useReviewStore.getState().reviews;
          console.log('Reviews after fetching:', currentReviews);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      }
    };
    
    fetchReviews();
  }, [bookId]); // Remove fetchBookReviews from dependencies to ensure it runs on mount
  
  // Fetch user's books when component mounts or user changes
  useEffect(() => {
    if (user) {
      const { fetchUserBooks } = useBookStore.getState();
      fetchUserBooks(user.id);
    }
  }, [user]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleReviewSubmit = async () => {
    if (!user || !bookId || !reviewText.trim()) return;
    
    try {
      if (editingReview) {
        // Update existing review
        await updateReview(editingReview.id, reviewText);
        setSnackbarMessage('Resenha atualizada com sucesso');
      } else {
        // Add new review
        await addReview({
          bookId,
          userId: user.id,
          text: reviewText,
        } as Omit<Review, 'id'>);
        setSnackbarMessage('Resenha adicionada com sucesso');
      }
      
      // Fetch reviews again to ensure the UI is updated with the latest data
      if (bookId) {
        const { fetchBookReviews } = useReviewStore.getState();
        await fetchBookReviews(bookId);
        console.log('Reviews after adding/updating:', useReviewStore.getState().reviews);
      }
      
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setReviewText('');
      setEditingReview(null);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving review:', error);
      setSnackbarMessage('Erro ao salvar resenha');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setReviewText(review.text);
    setOpenDialog(true);
  };

  const handleDeleteClick = (review: Review) => {
    setReviewToDelete(review);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    
    try {
      await deleteReview(reviewToDelete.id);
      setSnackbarMessage('Resenha excluída com sucesso');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting review:', error);
      setSnackbarMessage('Erro ao excluir resenha');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setConfirmDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setReviewToDelete(null);
  };

  const handleOpenDialog = () => {
    setEditingReview(null);
    setReviewText('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (booksLoading || reviewsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Livro não encontrado
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{ mt: 2 }}
          >
            Voltar para Livros
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleBackClick}
        sx={{ mb: 3 }}
      >
        Voltar
      </Button>
      
      {/* Book Details */}
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {book.title}
          </Typography>
          
          <Typography variant="h6" component="h2" color="text.secondary">
            por {book.author}
          </Typography>
          
          <Box 
            sx={{ 
              display: 'inline-block', 
              px: 2, 
              py: 0.5, 
              borderRadius: 1, 
              bgcolor: 
                book.status === 'read' 
                  ? 'success.light' 
                  : book.status === 'inProgress' 
                    ? 'warning.light' 
                    : 'info.light',
              color: 
                book.status === 'read' 
                  ? 'success.contrastText' 
                  : book.status === 'inProgress' 
                    ? 'warning.contrastText' 
                    : 'info.contrastText',
              alignSelf: 'flex-start',
              mb: 2
            }}
          >
            {getStatusLabel(book.status)}
          </Box>
          
          {book.status === 'read' && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" component="span" sx={{ mr: 1 }}>
                Avaliação:
              </Typography>
              <Rating value={book.rating} readOnly precision={0.5} />
              <Typography variant="body1" sx={{ ml: 1 }}>
                ({book.rating.toFixed(1)})
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Reviews Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: 3 
        }}>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }}
          >
            Resenhas
          </Typography>
          
          {user && !userReview && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handleOpenDialog}
              sx={{ borderRadius: 0 }}
            >
              Escrever Resenha
            </Button>
          )}
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {reviews.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 0 }}>
            <Typography variant="h6" gutterBottom>
              Nenhuma resenha ainda
            </Typography>
            <Typography variant="body1">
              Escreva a primeira resenha sobre este livro!
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reviews.map((review) => (
              <Card key={review.id} sx={{ borderRadius: 0, borderLeft: '4px solid', borderColor: 'secondary.main' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start' 
                    }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          whiteSpace: 'pre-wrap',
                          fontStyle: 'italic',
                          color: 'text.primary',
                          lineHeight: 1.6
                        }}
                      >
                        "{review.text}"
                      </Typography>
                      
                      {user && user.id === review.userId && (
                        <Box sx={{ display: 'flex', ml: 2 }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleEditReview(review)}
                            aria-label="editar resenha"
                            color="primary"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteClick(review)}
                            aria-label="excluir resenha"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
      
      {/* Add/Edit Review Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',

          } 
        }}
      >
        <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white', py: 2 }}>
          {editingReview ? 'Editar Resenha' : 'Escrever Resenha'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2, mt: 2 }}>
          <TextField
            autoFocus
            margin="dense"
            id="review"
            label="Sua opinião sobre o livro"
            placeholder="Compartilhe seus pensamentos sobre este livro..."
            fullWidth
            multiline
            rows={8}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 0 }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ borderRadius: 0 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleReviewSubmit} 
            variant="contained" 
            color="secondary"
            sx={{ borderRadius: 0 }}
          >
            {editingReview ? 'Atualizar' : 'Publicar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Confirm Delete Dialog */}
      <Dialog 
        open={confirmDeleteOpen} 
        onClose={handleCancelDelete}
        PaperProps={{ 
          sx: { 
            borderRadius: 0,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          } 
        }}
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white', py: 2 }}>
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ pt: 3 }}>
            Tem certeza que deseja excluir esta resenha? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCancelDelete}
            sx={{ borderRadius: 0 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            sx={{ borderRadius: 0 }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BookDetails;
