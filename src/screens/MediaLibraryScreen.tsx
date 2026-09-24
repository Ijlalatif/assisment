import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBookings} from '../context/BookingsContext';
import {colors} from '../theme/colors';

export function MediaLibraryScreen() {
  const insets = useSafeAreaInsets();
  const {bookings} = useBookings();

  return (
    <View style={[styles.screen, {paddingTop: insets.top + 16}]}>
      <Text style={styles.heading}>Media Library</Text>
      <FlatList
        data={bookings}
        keyExtractor={item => item.id}
        contentContainerStyle={bookings.length === 0 ? styles.emptyWrap : styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Tickets you reserve from the seat map show up here.
          </Text>
        }
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.meta}>
              {item.dateLabel} · {item.time} · {item.hall}
            </Text>
            <Text style={styles.meta}>Seats {item.seats.join(', ')}</Text>
            <Text style={styles.price}>${item.total}</Text>
          </View>
        )}
      />
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
    marginBottom: 12,
  },
  list: {
    paddingBottom: 120,
    gap: 12,
  },
  emptyWrap: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
  },
  price: {
    marginTop: 4,
    color: colors.text,
    fontWeight: '700',
  },
});
