import {StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../theme/colors';

export function MoreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, {paddingTop: insets.top + 16}]}>
      <Text style={styles.heading}>More</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Movie tickets</Text>
        <Text style={styles.body}>
          Upcoming movies come from The Movie Database. Open a title for details,
          play the trailer full screen, then pick a showtime and seats.
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Credits</Text>
        <Text style={styles.body}>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
          Seat selection is a preview only and does not charge a card.
        </Text>
      </View>
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  body: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
  },
});
