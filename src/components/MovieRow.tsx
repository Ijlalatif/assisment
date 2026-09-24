import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {imageUrl} from '../api/tmdb';
import {colors} from '../theme/colors';
import {Movie} from '../types';

type Props = {
  movie: Movie;
  subtitle: string;
  onPress: () => void;
};

export function MovieRow({movie, subtitle, onPress}: Props) {
  const source = imageUrl(movie.backdrop_path || movie.poster_path, 'w342');

  return (
    <Pressable style={styles.row} onPress={onPress}>
      {source ? (
        <Image source={{uri: source}} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.fallback]} />
      )}
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.more}>•••</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  poster: {
    width: 108,
    height: 72,
    borderRadius: 10,
    backgroundColor: colors.chip,
  },
  fallback: {
    backgroundColor: '#D9D9E3',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
  },
  more: {
    color: colors.primary,
    fontSize: 16,
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
});
