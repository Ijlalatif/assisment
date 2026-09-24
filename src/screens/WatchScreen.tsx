import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {discoverByGenre, imageUrl, searchMovies} from '../api/tmdb';
import {ScreenHeader} from '../components/ScreenHeader';
import {SearchField} from '../components/SearchField';
import {MovieRow} from '../components/MovieRow';
import {RootStackParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {Movie} from '../types';
import {genreName} from '../utils/format';

type Category = {
  name: string;
  genreId: number | null;
  query?: string;
};

const CATEGORIES: Category[] = [
  {name: 'Comedies', genreId: 35},
  {name: 'Crime', genreId: 80},
  {name: 'Family', genreId: 10751},
  {name: 'Documentaries', genreId: 99},
  {name: 'Dramas', genreId: 18},
  {name: 'Fantasy', genreId: 14},
  {name: 'Holidays', genreId: null, query: 'christmas'},
  {name: 'Horror', genreId: 27},
  {name: 'Sci-Fi', genreId: 878},
  {name: 'Thriller', genreId: 53},
];

type Mode = 'browse' | 'live' | 'results' | 'category';

export function WatchScreen() {
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>('browse');
  const [category, setCategory] = useState<Category | null>(null);
  const [covers, setCovers] = useState<Record<string, string | null>>({});
  const [movies, setMovies] = useState<Movie[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardWidth = (width - 40 - 12) / 2;

  useEffect(() => {
    let active = true;
    Promise.all(
      CATEGORIES.map(async item => {
        const data = item.genreId
          ? await discoverByGenre(item.genreId)
          : await searchMovies(item.query || item.name);
        const movie = data.results.find(result => result.backdrop_path);
        return [item.name, imageUrl(movie?.backdrop_path || movie?.poster_path || null, 'w500')] as const;
      }),
    )
      .then(entries => {
        if (active) {
          setCovers(Object.fromEntries(entries));
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (mode === 'browse') {
      return;
    }
    const handle = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const data =
          mode === 'category' && category
            ? category.genreId
              ? await discoverByGenre(category.genreId)
              : await searchMovies(category.query || category.name)
            : await searchMovies(query.trim());
        setMovies(data.results);
        setTotal(data.total_results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed.');
      } finally {
        setLoading(false);
      }
    }, mode === 'category' ? 0 : 300);
    return () => clearTimeout(handle);
  }, [mode, query, category]);

  const openMovie = (movie: Movie) => {
    navigation.navigate('MovieDetail', {movieId: movie.id});
  };

  const reset = () => {
    setQuery('');
    setCategory(null);
    setMovies([]);
    setMode('browse');
  };

  if (mode === 'results' || mode === 'category') {
    const title =
      mode === 'category' && category
        ? category.name
        : `${total} Results Found`;
    return (
      <View key="results-screen" style={styles.screen}>
        <ScreenHeader title={title} onBack={reset} />
        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.center} />
        ) : error ? (
          <Text style={styles.message}>{error}</Text>
        ) : (
          <FlatList
            key="movie-results"
            data={movies}
            keyExtractor={item => String(item.id)}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.message}>No movies found.</Text>}
            renderItem={({item}) => (
              <MovieRow
                movie={item}
                subtitle={genreName(item)}
                onPress={() => openMovie(item)}
              />
            )}
          />
        )}
      </View>
    );
  }

  return (
    <View key="browse-screen" style={[styles.screen, {paddingTop: insets.top + 16}]}>
      <View style={styles.searchPad}>
        <SearchField
          value={query}
          placeholder="TV shows, movies and more"
          onChangeText={text => {
            setQuery(text);
            setMode(text.trim() ? 'live' : 'browse');
          }}
          onSubmit={() => {
            if (query.trim()) {
              setMode('results');
            }
          }}
        />
      </View>
      {mode === 'live' ? (
        <View style={styles.flex}>
          <Text style={styles.section}>Top Results</Text>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={styles.center} />
          ) : (
            <FlatList
              key="live-results"
              data={movies}
              keyExtractor={item => String(item.id)}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.message}>
                  {error || 'No movies found.'}
                </Text>
              }
              renderItem={({item}) => (
                <MovieRow
                  movie={item}
                  subtitle={genreName(item)}
                  onPress={() => openMovie(item)}
                />
              )}
            />
          )}
        </View>
      ) : (
        <FlatList
          key="genre-grid"
          data={CATEGORIES}
          keyExtractor={item => item.name}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
          renderItem={({item}) => (
            <Pressable
              style={[styles.card, {width: cardWidth, height: cardWidth * 0.72}]}
              onPress={() => {
                setCategory(item);
                setMode('category');
              }}>
              {covers[item.name] ? (
                <ImageBackground
                  source={{uri: covers[item.name] as string}}
                  style={styles.cardImage}
                  imageStyle={styles.cardImageRadius}>
                  <View style={styles.cardShade} />
                  <Text style={styles.cardTitle}>{item.name}</Text>
                </ImageBackground>
              ) : (
                <View style={[styles.cardImage, styles.cardFallback]}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                </View>
              )}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  searchPad: {
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  section: {
    marginLeft: 20,
    marginBottom: 6,
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 12,
  },
  gridRow: {
    gap: 12,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#C9C9D4',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardImageRadius: {
    borderRadius: 12,
  },
  cardShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  cardFallback: {
    backgroundColor: '#3D4258',
    justifyContent: 'flex-end',
  },
  cardTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    margin: 12,
  },
  center: {
    marginTop: 40,
  },
  message: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
