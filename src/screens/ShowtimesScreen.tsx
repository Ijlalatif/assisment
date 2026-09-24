import {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CinemaSeat} from '../components/CinemaSeat';
import {ScreenHeader} from '../components/ScreenHeader';
import {buildSeatRows, nextDates, SHOWTIMES} from '../data/showtimes';
import {RootStackParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {Seat} from '../types';
import {formatLongDate, formatSeatDate, formatShortDate} from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'Showtimes'>;

const DOT: Record<Seat['status'], string> = {
  regular: '#61C3F2',
  vip: '#564CA3',
  taken: '#F0C9C9',
};

function MiniMap() {
  const rows = buildSeatRows();
  return (
    <View style={styles.mini}>
      <View style={styles.arc} />
      {rows.map(row => {
        const mid = Math.floor(row.length / 2);
        return (
          <View key={row[0].row} style={styles.miniRow}>
            {row.map((seat, index) => (
              <View
                key={`${seat.row}-${seat.number}`}
                style={[styles.dot, index === mid && styles.aisle]}>
                <CinemaSeat color={DOT[seat.status]} size={7} />
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

export function ShowtimesScreen({route, navigation}: Props) {
  const {movieId, title, releaseDate} = route.params;
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();
  const cardWidth = Math.min(width * 0.74, 300);
  const dates = nextDates();
  const [dateIndex, setDateIndex] = useState(0);
  const [showIndex, setShowIndex] = useState(0);
  const selected = SHOWTIMES[showIndex];
  const selectedDate = dates[dateIndex];

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={title}
        subtitle={`In Theaters ${formatLongDate(releaseDate)}`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.dateRow}>
          {dates.map((date, index) => {
            const active = index === dateIndex;
            return (
              <Pressable
                key={date.toISOString()}
                style={[styles.dateChip, active && styles.dateChipActive]}
                onPress={() => setDateIndex(index)}>
                <Text style={[styles.dateText, active && styles.dateTextActive]}>
                  {formatShortDate(date)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.showRow}>
          {SHOWTIMES.map((show, index) => {
            const active = index === showIndex;
            return (
              <Pressable
                key={show.id}
                style={[styles.showCard, {width: cardWidth}]}
                onPress={() => setShowIndex(index)}>
                <Text style={styles.showMeta} numberOfLines={1}>
                  <Text style={styles.showTime}>{show.time}</Text>
                  {`   ${show.hall}`}
                </Text>
                <View style={[styles.preview, active && styles.previewActive]}>
                  <MiniMap />
                </View>
                <Text style={styles.price}>
                  From {show.price}$
                  <Text style={styles.bonus}> or {show.bonus} bonus</Text>
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </ScrollView>
      <View style={[styles.footer, {paddingBottom: insets.bottom + 16}]}>
        <Pressable
          style={styles.button}
          onPress={() =>
            navigation.navigate('SeatMap', {
              movieId,
              title,
              dateLabel: formatSeatDate(selectedDate),
              time: selected.time,
              hall: selected.hall.replace('Cinetech + ', ''),
            })
          }>
          <Text style={styles.buttonText}>Select Seats</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 24,
  },
  label: {
    marginTop: 22,
    marginLeft: 20,
    marginBottom: 14,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  dateRow: {
    paddingHorizontal: 20,
    gap: 10,
  },
  dateChip: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  dateChipActive: {
    backgroundColor: colors.primary,
  },
  dateText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  dateTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  showRow: {
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 16,
  },
  showCard: {
    width: 260,
  },
  showMeta: {
    color: '#8B8B97',
    marginBottom: 12,
    fontSize: 13,
  },
  showTime: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
  },
  preview: {
    height: 196,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E6EE',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  previewActive: {
    borderColor: colors.primary,
  },
  mini: {
    alignItems: 'center',
    gap: 3,
  },
  arc: {
    width: 150,
    height: 14,
    borderTopWidth: 1.5,
    borderColor: '#E4E6EF',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    marginBottom: 10,
  },
  miniRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    marginHorizontal: 0.5,
  },
  aisle: {
    marginLeft: 10,
  },
  price: {
    marginTop: 12,
    color: colors.text,
    fontWeight: '700',
    fontSize: 13,
  },
  bonus: {
    color: '#8B8B97',
    fontWeight: '400',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
