import { Card, CardMedia, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';

function Filme({ nome, ano, imagem, nota, aoClicar, eFavorito, aoFavoritar }) {
  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.02)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      {/* Botão de Favorito */}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          aoFavoritar();
        }}
        aria-label="favoritar"
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          color: eFavorito ? '#e50914' : '#fff',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            transform: 'scale(1.15)',
          },
        }}
      >
        {eFavorito ? <FaHeart /> : <FaRegHeart />}
      </IconButton>

      {/* Imagem / Poster */}
      <Box sx={{ position: 'relative', cursor: 'pointer' }} onClick={aoClicar}>
        <CardMedia
          component="img"
          image={imagem}
          alt={nome}
          sx={{
            height: 340,
            objectFit: 'cover',
          }}
        />
        {/* Badge da nota */}
        <Chip
          icon={<FaStar style={{ color: '#f5c518', fontSize: '0.85rem' }} />}
          label={nota}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            fontWeight: 'bold',
          }}
        />
      </Box>

      {/* Conteúdo do Card */}
      <CardContent onClick={aoClicar} sx={{ cursor: 'pointer', flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          noWrap
          title={nome}
          sx={{ fontSize: '1rem', mb: 0.5 }}
        >
          {nome}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {ano}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Filme;