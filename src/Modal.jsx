import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { FaTimes, FaStar, FaCalendarAlt } from 'react-icons/fa';

function Modal({ filme, aoFechar }) {
  if (!filme) return null;

  const anoLancamento = filme.release_date
    ? new Date(filme.release_date).toLocaleDateString('pt-BR')
    : 'N/A';

  return (
    <Dialog
      open={Boolean(filme)}
      onClose={aoFechar}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#1a1a1a',
          color: '#fff',
          borderRadius: 3,
          backgroundImage: 'none',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          {filme.title}
        </Typography>
        <IconButton onClick={aoFechar} sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}>
          <FaTimes />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, pt: 1 }}>
        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
          <Box
            component="img"
            src={
              filme.poster_path
                ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
                : 'https://placehold.co/500x750/1e1e1e/FFF?text=Sem+Imagem'
            }
            alt={filme.title}
            sx={{
              width: { xs: '100%', sm: '220px' },
              maxWidth: '260px',
              borderRadius: 2,
              boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
              objectFit: 'cover',
            }}
          />

          <Box flex={1}>
            <Stack direction="row" spacing={1} mb={2.5} flexWrap="wrap" gap={1}>
              <Chip
                icon={<FaCalendarAlt style={{ color: '#e50914' }} />}
                label={`Lançamento: ${anoLancamento}`}
                variant="outlined"
                sx={{ borderColor: '#333', color: '#ccc' }}
              />
              <Chip
                icon={<FaStar style={{ color: '#f5c518' }} />}
                label={`Avaliação: ${filme.vote_average ? filme.vote_average.toFixed(1) : 'N/A'} / 10`}
                variant="outlined"
                sx={{ borderColor: '#333', color: '#ccc' }}
              />
            </Stack>

            <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
              Sinopse
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {filme.overview || 'Sem sinopse disponível em português para este filme.'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;