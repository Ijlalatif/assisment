import {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getImages, getMovie, getVideos, imageUrl, pickTrailer} from '../api/tmdb';
import {BackIcon} from '../components/Icons';
import {RootStackParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {MovieDetails, MovieImage} from '../types';
import {formatLongDate, runtimeLabel} from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'MovieDetail'>;

export function MovieDetailScreen({route, navigation}: Props) {
  const {movieId} = route.params;
  const insets = useSafeAreaInsets();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [images, setImages] = useState<MovieImage[]>([]);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [details, imageData, videoData] = await Promise.all([
        getMovie(movieId),
        getImages(movieId).catch(() => ({backdrops: [], posters: []})),
        getVideos(movieId).catch(() => ({results: []})),
      ]);
      setMovie(details);
      setImages((imageData.backdrops ?? []).slice(0, 10));
      setTrailerKey(pickTrailer(videoData.results ?? [])?.key ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load this movie.');
    } finally {
      setLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!movie || error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || 'Movie unavailable.'}</Text>
        <Pressable style={styles.primary} onPress={load}>
          <Text style={styles.primaryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  const backdrop = imageUrl(movie.backdrop_path, 'w780');
  const meta = [
    formatLongDate(movie.release_date),
    runtimeLabel(movie.runtime),
    movie.vote_average ? `${movie.vote_average.toFixed(1)} ★` : '',
  ]
    .filter(Boolean)
    .join('  ·  ');

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{paddingBottom: insets.bottom + 24}}>
        <View>
          {backdrop ? (
            <Image source={{uri: backdrop}} style={styles.backdrop} />
          ) : (
            <View style={[styles.backdrop, styles.fallback]} />
          )}
          <Pressable
            style={[styles.back, {top: insets.top + 8}]}
            onPress={() => navigation.goBack()}
            hitSlop={12}>
            <BackIcon />
          </Pressable>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.meta}>{meta}</Text>
          <View style={styles.chips}>
            {(movie.genres ?? []).map(genre => (
              <View key={genre.id} style={styles.chip}>
                <Text style={styles.chipText}>{genre.name}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.section}>Overview</Text>
          <Text style={styles.overview}>{movie.overview || 'No overview yet.'}</Text>
          {images.length > 0 ? (
            <>
              <Text style={styles.section}>Photos</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map(image => (
                  <Image
                    key={image.file_path}
                    source={{uri: imageUrl(image.file_path, 'w300') || ''}}
                    style={styles.photo}
                  />
                ))}
              </ScrollView>
            </>
          ) : null}
          <Pressable
            style={styles.outline}
            onPress={() => {
              if (!trailerKey) {
                Alert.alert('No trailer', 'This movie does not have a trailer yet.');
                return;
              }
              navigation.navigate('Trailer', {
                videoKey: trailerKey,
                title: movie.title,
              });
            }}>
            <Text style={styles.outlineText}>Watch Trailer</Text>
          </Pressable>
          <Pressable
            style={styles.primary}
            onPress={() =>
              navigation.navigate('Showtimes', {
                movieId: movie.id,
                title: movie.title,
                releaseDate: movie.release_date,
              })
            }>
            <Text style={styles.primaryText}>Get Tickets</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
  },
  backdrop: {
    width: '100%',
    height: 240,
    backgroundColor: colors.chip,
  },
  fallback: {
    backgroundColor: '#2E2739',
  },
  back: {
    position: 'absolute',
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 20,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    marginTop: 6,
    fontSize: 13,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  chip: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginTop: 22,
    marginBottom: 8,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  overview: {
    color: '#4A5568',
    fontSize: 14,
    lineHeight: 21,
  },
  photo: {
    width: 160,
    height: 96,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: colors.chip,
  },
  outline: {
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  primary: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  error: {
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
});
