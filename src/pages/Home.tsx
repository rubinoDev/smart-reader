import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarIcon from '@mui/icons-material/Star';
import { useAuthStore } from '../context/authStore';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      title: 'Acompanhe Suas Leituras',
      description: 'Mantenha o controle dos livros que deseja ler, está lendo atualmente ou já terminou.',
      icon: <AutoStoriesIcon fontSize="large" />,
    },
    {
      title: 'Escreva Resenhas',
      description: 'Compartilhe seus pensamentos e insights sobre os livros que você leu.',
      icon: <MenuBookIcon fontSize="large" />,
    },
    {
      title: 'Avalie Livros',
      description: 'Avalie livros em uma escala de 1 a 5 estrelas e veja seus livros mais bem avaliados.',
      icon: <StarIcon fontSize="large" />,
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', fontSize: isMobile ? '2.5rem' : '3.5rem' }}
          >
            SmartReader
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ mb: 4, fontWeight: 300 }}
          >
            Seu companheiro pessoal de leitura
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate(user ? '/dashboard' : '/register')}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            {user ? 'Ir para o Painel' : 'Começar Agora'}
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Funcionalidades
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {features.map((feature, index) => (
            <Box 
              key={index.toString()} 
              sx={{ 
                flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 32px)' },
                maxWidth: { xs: '100%', md: 'calc(33.333% - 32px)' }
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          bgcolor: 'secondary.light',
          py: 6,
          textAlign: 'center',
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Pronto para iniciar sua jornada de leitura?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Junte-se ao SmartReader hoje e leve sua experiência de leitura para o próximo nível.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate(user ? '/dashboard' : '/register')}
          >
            {user ? 'Ir para o Painel' : 'Cadastre-se Agora'}
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} SmartReader. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
