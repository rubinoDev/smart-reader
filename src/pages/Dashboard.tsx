import { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  CircularProgress,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useAuthStore } from '../context/authStore';
import { useBookStore } from '../context/bookStore';
import { getBookCountByStatus, getTotalBookCount } from '../utils/helpers';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { books, loading, fetchUserBooks } = useBookStore();
  const theme = useTheme();

  useEffect(() => {
    if (user) {
      fetchUserBooks(user.id);
    }
  }, [user, fetchUserBooks]);

  const totalBooks = getTotalBookCount(books);
  const desiredBooks = getBookCountByStatus(books, 'desired');
  const inProgressBooks = getBookCountByStatus(books, 'inProgress');
  const readBooks = getBookCountByStatus(books, 'read');

  const summaryCards = [
    {
      title: 'Total de Livros',
      count: totalBooks,
      icon: <AutoStoriesIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Livros para Ler',
      count: desiredBooks,
      icon: <BookmarkIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
    },
    {
      title: 'Em Andamento',
      count: inProgressBooks,
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Livros Lidos',
      count: readBooks,
      icon: <AutoStoriesIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main,
    },
  ];

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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bem-vindo, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aqui está um resumo da sua atividade de leitura.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
        {summaryCards.map((card, index) => (
          <Box
            key={index}
            sx={{
              flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' },
              maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderTop: `4px solid ${card.color}`,
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 4,
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  {card.title}
                </Typography>
                <Box sx={{ color: card.color }}>{card.icon}</Box>
              </Box>
              <Typography variant="h3" component="p" sx={{ fontWeight: 'bold' }}>
                {card.count}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {books.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Você ainda não adicionou nenhum livro.
          </Typography>
          <Typography variant="body1">
            Comece a construir sua biblioteca adicionando livros que você deseja ler, está lendo atualmente ou já leu.
          </Typography>
        </Paper>
      ) : (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Livros Adicionados Recentemente
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {books.slice(0, 3).map((book) => (
              <Card 
                key={book.id} 
                sx={{ 
                  flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 8px)' },
                  maxWidth: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(33.333% - 8px)' }
                }}
              >
                <CardContent>
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
                    }}
                  >
                    {book.status === 'read' 
                      ? 'Lido' 
                      : book.status === 'inProgress' 
                        ? 'Em Andamento' 
                        : 'Para Ler'}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Dashboard;
