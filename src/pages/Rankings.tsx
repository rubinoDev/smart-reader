import { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useAuthStore } from '../context/authStore';
import { useBookStore } from '../context/bookStore';

type SortOption = 'rating' | 'title' | 'author';
type FilterOption = 'all' | string;

const Rankings = () => {
  const { user } = useAuthStore();
  const { books, loading, fetchUserBooks } = useBookStore();
  
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [filterAuthor, setFilterAuthor] = useState<FilterOption>('all');
  const [authors, setAuthors] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchUserBooks(user.id);
    }
  }, [user, fetchUserBooks]);

  useEffect(() => {
    // Extract unique authors from books
    if (books.length > 0) {
      const uniqueAuthors = [...new Set(books.map(book => book.author))];
      setAuthors(uniqueAuthors.sort());
    }
  }, [books]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as SortOption);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterAuthor(event.target.value);
  };

  // Filter books by author if filter is applied
  const filteredBooks = filterAuthor === 'all' 
    ? books 
    : books.filter(book => book.author === filterAuthor);

  // Sort books based on selected sort option
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating; // Descending for ratings
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title); // Ascending for titles
    } else if (sortBy === 'author') {
      return a.author.localeCompare(b.author); // Ascending for authors
    }
    return 0;
  });

  // Only include books that have been read and rated
  const ratedBooks = sortedBooks.filter(book => book.status === 'read' && book.rating > 0);

  // Get top 3 books for the featured section
  const topBooks = [...books]
    .filter(book => book.status === 'read' && book.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

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
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
        Classificação de Livros
      </Typography>

      {/* Featured Top Books Section */}
      {topBooks.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3  ,fontSize: { xs: '1rem', sm: '1.25rem' }}} >
            Livros Mais Bem Avaliados
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {topBooks.map((book, index) => (
              <Card 
                key={book.id} 
                sx={{ 
                  flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 16px)' },
                  maxWidth: { xs: '100%', sm: 'calc(33.333% - 16px)' },
                  position: 'relative',
                  overflow: 'visible',
                  padding: 1.25,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 
                      index === 0 
                        ? 'gold' 
                        : index === 1 
                          ? 'silver' 
                          : '#cd7f32', // bronze
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1,
                    boxShadow: 2,
                  },
                  '&::after': {
                    content: `"${index + 1}"`,
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2,
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: 'white',
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    por {book.author}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Rating value={book.rating} readOnly precision={0.5} />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {book.rating.toFixed(1)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      {/* All Rated Books Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb:'1rem', fontSize: { xs: '1rem', sm: '1.5rem' } }}>
          Todos os Livros Avaliados
        </Typography>
        
        {/* Filter and Sort Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort-by-label">Ordenar Por</InputLabel>
            <Select
              labelId="sort-by-label"
              value={sortBy}
              label="Ordenar Por"
              onChange={handleSortChange}
              size="small"
            >
              <MenuItem value="rating">Avaliação (Maior Primeiro)</MenuItem>
              <MenuItem value="title">Título (A-Z)</MenuItem>
              <MenuItem value="author">Autor (A-Z)</MenuItem>
            </Select>
          </FormControl>
          
          {authors.length > 0 && (
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="filter-author-label">Filtrar por Autor</InputLabel>
              <Select
                labelId="filter-author-label"
                value={filterAuthor}
                label="Filtrar por Autor"
                onChange={handleFilterChange}
                size="small"
              >
                <MenuItem value="all">Todos os Autores</MenuItem>
                {authors.map(author => (
                  <MenuItem key={author} value={author}>{author}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
        
        {ratedBooks.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Nenhum livro avaliado ainda.
            </Typography>
            <Typography variant="body1" >
              Avalie seus livros para vê-los na classificação.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="tabela de classificação de livros">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.light' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Posição</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Título</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Autor</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Avaliação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ratedBooks.map((book, index) => (
                  <TableRow
                    key={book.id}
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                      '&:hover': { backgroundColor: 'action.selected' }
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={book.rating} readOnly size="small" precision={0.5} />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({book.rating.toFixed(1)})
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default Rankings;
