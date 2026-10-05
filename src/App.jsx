import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Pagination,
  Box,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { FaSearch } from 'react-icons/fa';
import Filme from './Filme';
import Modal from './Modal';

function App() {
  const [filmes, setFilmes] = useState([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);

  const [favoritos, setFavoritos] = useState(() => {
    const salvos = localStorage.getItem('filmes_favoritos');
    return salvos ? JSON.parse(salvos) : [];
  });

  const apiKey = import.meta.env.VITE_TMDB_API_KEY;

  async function carregarFilmes(query = '', numPagina = 1) {
    setLoading(true);
    setErro(null);

    const url = query
      ? `https://api.themoviedb.org/3/search/movie`
      : `https://api.themoviedb.org/3/movie/popular`;

    try {
      const response = await axios.get(url, {
        params: {
          api_key: apiKey,
          language: 'pt-BR',
          page: numPagina,
          ...(query && { query }),
        },
      });

      setFilmes(response.data.results || []);
      setTotalPaginas(response.data.total_pages || 1);
    } catch (err) {
      setErro('Não foi possível carregar os filmes. Verifique sua conexão e chave de API.');
    } finally {
      setLoading(false);
    }
  }

  // Debounce para busca automática ao digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagina(1);
      carregarFilmes(busca, 1);
    }, 500);

    return () => clearTimeout(timer);
  }, [busca]);

  // Recarrega filmes quando a página muda
  useEffect(() => {
    carregarFilmes(busca, pagina);
  }, [pagina]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagina(1);
    carregarFilmes(busca, 1);
  };

  const toggleFavorito = (filme) => {
    let atualizados;
    if (favoritos.some((f) => f.id === filme.id)) {
      atualizados = favoritos.filter((f) => f.id !== filme.id);
    } else {
      atualizados = [...favoritos, filme];
    }
    setFavoritos(atualizados);
    localStorage.setItem('filmes_favoritos', JSON.stringify(atualizados));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Cabeçalho */}
      <Box textAlign="center" mb={5}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="800"
          sx={{
            background: 'linear-gradient(45deg, #e50914 30%, #ff5252 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px',
            mb: 1,
          }}
        >
          CineExplora
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Descubra os filmes mais populares ou busque pelos seus favoritos
        </Typography>
      </Box>

      {/* Barra de Pesquisa */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        display="flex"
        justifyContent="center"
        gap={1.5}
        mb={5}
      >
        <TextField
          variant="outlined"
          placeholder="Pesquisar um filme..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch color="#888" />
              </InputAdornment>
            ),
          }}
          sx={{
            width: '100%',
            maxWidth: '500px',
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#1f1f1f',
              borderRadius: '30px',
              px: 2,
              '& fieldset': { borderColor: '#333' },
              '&:hover fieldset': { borderColor: '#e50914' },
              '&.Mui-focused fieldset': { borderColor: '#e50914' },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            borderRadius: '30px',
            px: 3,
            fontWeight: 'bold',
            textTransform: 'none',
          }}
        >
          Buscar
        </Button>
      </Box>

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress color="primary" size={50} />
        </Box>
      )}

      {/* Erro */}
      {erro && (
        <Typography color="error" align="center" my={6} variant="h6">
          {erro}
        </Typography>
      )}

      {/* Lista de Filmes */}
      {!loading && !erro && (
        <>
          {filmes.length === 0 ? (
            <Typography align="center" color="text.secondary" my={6} variant="h6">
              Nenhum filme encontrado.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filmes.map((item) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <Filme
                    nome={item.title}
                    ano={item.release_date ? item.release_date.split('-')[0] : 'N/A'}
                    imagem={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : 'https://placehold.co/500x750/1e1e1e/FFF?text=Sem+Imagem'
                    }
                    nota={item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}
                    aoClicar={() => setFilmeSelecionado(item)}
                    eFavorito={favoritos.some((f) => f.id === item.id)}
                    aoFavoritar={() => toggleFavorito(item)}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Paginação */}
          {filmes.length > 0 && (
            <Box display="flex" justifyContent="center" mt={6}>
              <Pagination
                count={totalPaginas > 500 ? 500 : totalPaginas}
                page={pagina}
                onChange={(e, val) => setPagina(val)}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#fff',
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Modal de Detalhes */}
      <Modal filme={filmeSelecionado} aoFechar={() => setFilmeSelecionado(null)} />
    </Container>
  );
}

export default App;