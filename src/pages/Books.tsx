import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuthStore } from '../context/authStore';
import { useBookStore } from '../context/bookStore';
import { Book, BookStatus } from '../types';
import { getStatusLabel } from '../utils/helpers';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`books-tabpanel-${index}`}
      aria-labelledby={`books-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Books = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { books, loading, fetchUserBooks, addBook, updateBook, deleteBook } = useBookStore();
  
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formStatus, setFormStatus] = useState<BookStatus>('desired');
  const [formRating, setFormRating] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserBooks(user.id);
    }
  }, [user, fetchUserBooks]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormTitle(book.title);
      setFormAuthor(book.author);
      setFormStatus(book.status);
      setFormRating(book.rating);
    } else {
      setEditingBook(null);
      setFormTitle('');
      setFormAuthor('');
      setFormStatus('desired');
      setFormRating(0);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    if (!formTitle.trim() || !formAuthor.trim()) {
      setSnackbarMessage('Por favor, preencha todos os campos obrigatórios');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (editingBook) {
        // Update existing book
        await updateBook(editingBook.id, {
          title: formTitle,
          author: formAuthor,
          status: formStatus,
          rating: formRating,
        });
        setSnackbarMessage('Livro atualizado com sucesso');
      } else {
        // Add new book
        await addBook({
          title: formTitle,
          author: formAuthor,
          status: formStatus,
          userId: user.id,
          rating: formRating,
        } as Omit<Book, 'id'>);
        setSnackbarMessage('Livro adicionado com sucesso');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving book:', error);
      setSnackbarMessage('Error saving book');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteClick = (book: Book) => {
    setBookToDelete(book);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    
    try {
      await deleteBook(bookToDelete.id);
      setSnackbarMessage('Livro excluído com sucesso');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error deleting book:', error);
      setSnackbarMessage('Error deleting book');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
    setConfirmDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setBookToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const filteredBooks = (status: BookStatus) => {
    return books.filter((book) => book.status === status);
  };

  const renderBookCards = (status: BookStatus) => {
    const filtered = filteredBooks(status);
    
    if (filtered.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Nenhum livro nesta categoria ainda.
          </Typography>
        </Box>
      );
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {filtered.map((book) => (
          <Card 
            key={book.id} 
            sx={{ 
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 8px)' },
              maxWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 8px)' },
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <CardContent 
              sx={{ 
                flexGrow: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.03)'
                }
              }}
              onClick={() => navigate(`/books/${book.id}`)}
            >
              <Typography variant="h6" component="h3" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                por {book.author}
              </Typography>
              {book.status === 'read' && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                    Avaliação:
                  </Typography>
                  <Rating value={book.rating} readOnly size="small" />
                </Box>
              )}
            </CardContent>
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
              <Button
                variant="outlined"
                size="small"
                color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/books/${book.id}`);
                }}
                sx={{ borderRadius: 0 }}
              >
                Ver Detalhes
              </Button>
              <Box>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDialog(book);
                  }}
                  aria-label="edit book"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(book);
                  }}
                  aria-label="delete book"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </CardActions>
          </Card>
        ))}
      </Box>
    );
  };

  if (loading) {
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 4 
      }}>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}
        >
          Meus Livros
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
        >
          Adicionar Livro
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="book status tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Todos os Livros" id="books-tab-0" aria-controls="books-tabpanel-0" />
          <Tab label="Para Ler" id="books-tab-1" aria-controls="books-tabpanel-1" />
          <Tab label="Em Andamento" id="books-tab-2" aria-controls="books-tabpanel-2" />
          <Tab label="Lidos" id="books-tab-3" aria-controls="books-tabpanel-3" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {books.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Você ainda não adicionou nenhum livro.
            </Typography>
            <Typography variant="body1">
              Clique no botão "Adicionar Livro" para começar a construir sua biblioteca.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {books.map((book) => (
              <Card 
                key={book.id} 
                sx={{ 
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 8px)' },
                  maxWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 8px)' },
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent 
                  sx={{ 
                    flexGrow: 1,
                  
                  }}

                >
                  <Typography variant="h6" component="h3" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    por {book.author}
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'inline-block', 
                      px: 1, 
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
                      mb: 1
                    }}
                  >
                    {getStatusLabel(book.status)}
                  </Box>
                  {book.status === 'read' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                        Avaliação:
                      </Typography>
                      <Rating value={book.rating} readOnly size="small" />
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/books/${book.id}`);
                    }}
                    sx={{ borderRadius: 0 }}
                  >
                    Ver Detalhes
                  </Button>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(book);
                      }}
                      aria-label="edit book"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(book);
                      }}
                      aria-label="delete book"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {renderBookCards('desired')}
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        {renderBookCards('inProgress')}
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        {renderBookCards('read')}
      </TabPanel>

      {/* Add/Edit Book Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBook ? 'Editar Livro' : 'Adicionar Novo Livro'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <TextField
              label="Título"
              fullWidth
              required
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <TextField
              label="Autor"
              fullWidth
              required
              value={formAuthor}
              onChange={(e) => setFormAuthor(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id="book-status-label">Status</InputLabel>
              <Select
                labelId="book-status-label"
                value={formStatus}
                label="Status"
                onChange={(e) => setFormStatus(e.target.value as BookStatus)}
              >
                <MenuItem value="desired">Para Ler</MenuItem>
                <MenuItem value="inProgress">Em Andamento</MenuItem>
                <MenuItem value="read">Lido</MenuItem>
              </Select>
            </FormControl>
            {formStatus === 'read' && (
              <Box>
                <Typography component="legend">Avaliação</Typography>
                <Rating
                  name="book-rating"
                  value={formRating}
                  onChange={(_event, newValue) => {
                    setFormRating(newValue || 0);
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingBook ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir "{bookToDelete?.title}"? Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error">
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

export default Books;
