import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getUpcoming} from '../api/tmdb';
import {MovieRow} from '../components/MovieRow';
import {RootStackParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {Movie} from '../types';
import {formatLongDate, genreName} from '../utils/format';

export function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async (nextPage: number, replace: boolean) => {
    try {
      if (replace) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      const data = await getUpcoming(nextPage);
      setMovies(current => (replace ? data.results : [...current, ...data.results]));
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load movies.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    load(1, true);
  }, []);

  return (
    <View style={[styles.screen, {paddingTop: insets.top + 12}]}>
      <Text style={styles.heading}>Upcoming Movies</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.center} />
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.retry} onPress={() => load(1, true)}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          onEndReached={() => {
            if (!loadingMore && page < totalPages) {
              load(page + 1, false);
            }
          }}
          onEndReachedThreshold={0.4}
          refreshing={loading}
          onRefresh={() => load(1, true)}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={colors.primary} style={styles.footer} />
            ) : undefined
          }
          renderItem={({item}) => (
            <MovieRow
              movie={item}
              subtitle={`${formatLongDate(item.release_date)} · ${genreName(item)}`}
              onPress={() =>
                navigation.navigate('MovieDetail', {movieId: item.id})
              }
            />
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
    paddingHorizontal: 20,
  },
  heading: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  list: {
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  error: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  retry: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  retryText: {
    color: colors.white,
    fontWeight: '600',
  },
  footer: {
    marginVertical: 16,
  },
});
