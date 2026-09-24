import {useMemo, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CinemaSeat} from '../components/CinemaSeat';
import {ScreenHeader} from '../components/ScreenHeader';
import {useBookings} from '../context/BookingsContext';
import {buildSeatRows, seatPrice, VIP_PRICE, REGULAR_PRICE} from '../data/showtimes';
import {RootStackParamList} from '../navigation/types';
import {colors} from '../theme/colors';
import {Seat} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'SeatMap'>;

const SEAT_COLOR: Record<Seat['status'], string> = {
  regular: colors.regular,
  vip: colors.vip,
  taken: colors.unavailable,
};

function seatId(seat: Seat) {
  return `${seat.row}-${seat.number}`;
}

export function SeatMapScreen({route, navigation}: Props) {
  const {movieId, title, dateLabel, time, hall} = route.params;
  const insets = useSafeAreaInsets();
  const {addBooking} = useBookings();
  const rows = useMemo(() => buildSeatRows(), []);
  const [selected, setSelected] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);

  const selectedSeats = rows
    .flat()
    .filter(seat => selected.includes(seatId(seat)));
  const total = selectedSeats.reduce((sum, seat) => sum + seatPrice(seat.status), 0);

  const toggle = (seat: Seat) => {
    if (seat.status === 'taken') {
      return;
    }
    const id = seatId(seat);
    setSelected(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id],
    );
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={title}
        subtitle={`${dateLabel} | ${time} ${hall}`}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.mapArea}>
        <ScrollView
          contentContainerStyle={styles.mapContent}
          maximumZoomScale={2}
          minimumZoomScale={0.8}>
          <View style={[styles.map, {transform: [{scale: zoom}]}]}>
            <View style={styles.curveWrap}>
              <View style={styles.curve} />
              <Text style={styles.screenLabel}>SCREEN</Text>
            </View>
            {rows.map(row => (
              <View key={row[0].row} style={styles.seatRow}>
                <Text style={styles.rowIndex}>{row[0].row}</Text>
                <View style={styles.seats}>
                  {row.map((seat, index) => {
                    const id = seatId(seat);
                    const isSelected = selected.includes(id);
                    const aisle = index === Math.floor(row.length / 2);
                    return (
                      <Pressable
                        key={id}
                        disabled={seat.status === 'taken'}
                        onPress={() => toggle(seat)}
                        style={[styles.seat, aisle && styles.aisle]}>
                        <CinemaSeat
                          size={15}
                          color={isSelected ? colors.gold : SEAT_COLOR[seat.status]}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.zoom}>
          <Pressable
            style={styles.zoomBtn}
            onPress={() => setZoom(value => Math.min(1.6, +(value + 0.15).toFixed(2)))}>
            <Text style={styles.zoomText}>+</Text>
          </Pressable>
          <Pressable
            style={styles.zoomBtn}
            onPress={() => setZoom(value => Math.max(0.75, +(value - 0.15).toFixed(2)))}>
            <Text style={styles.zoomText}>−</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={[styles.sheet, {paddingBottom: insets.bottom + 12}]}>
        <View style={styles.legend}>
          <Legend color={colors.gold} label="Selected" />
          <Legend color={colors.unavailable} label="Not available" />
          <Legend color={colors.vip} label={`VIP (${VIP_PRICE}$)`} />
          <Legend color={colors.regular} label={`Regular (${REGULAR_PRICE} $)`} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {selectedSeats.map(seat => (
            <View key={seatId(seat)} style={styles.chip}>
              <Text style={styles.chipText}>
                {seat.number} / {seat.row} row
              </Text>
              <Pressable hitSlop={8} onPress={() => toggle(seat)}>
                <Text style={styles.chipClose}>×</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>$ {total}</Text>
          </View>
          <Pressable
            style={[styles.pay, selectedSeats.length === 0 && styles.payDisabled]}
            disabled={selectedSeats.length === 0}
            onPress={() => {
              addBooking({
                id: `${movieId}-${Date.now()}`,
                movieId,
                title,
                dateLabel,
                time,
                hall,
                seats: selectedSeats.map(seat => `${seat.number}/${seat.row}`),
                total,
              });
              Alert.alert(
                'Seats reserved',
                `${selectedSeats.length} seat(s) · $${total}. This booking preview is saved in Media Library.`,
                [{text: 'OK', onPress: () => navigation.popToTop()}],
              );
            }}>
            <Text style={styles.payText}>Proceed to pay</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function Legend({color, label}: {color: string; label: string}) {
  return (
    <View style={styles.legendItem}>
      <CinemaSeat color={color} size={16} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapArea: {
    flex: 1,
  },
  mapContent: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  map: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  curveWrap: {
    width: 280,
    height: 36,
    alignItems: 'center',
    marginBottom: 18,
  },
  curve: {
    position: 'absolute',
    top: 0,
    width: 260,
    height: 28,
    borderTopWidth: 2,
    borderColor: '#D9DCE8',
    borderTopLeftRadius: 140,
    borderTopRightRadius: 140,
  },
  screenLabel: {
    marginTop: 14,
    color: '#C4C6D0',
    fontSize: 10,
    letterSpacing: 2,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rowIndex: {
    width: 18,
    color: colors.muted,
    fontSize: 11,
  },
  seats: {
    flexDirection: 'row',
  },
  seat: {
    marginHorizontal: 2,
    marginBottom: 2,
  },
  aisle: {
    marginLeft: 16,
  },
  zoom: {
    position: 'absolute',
    right: 18,
    bottom: 10,
    flexDirection: 'row',
    gap: 10,
  },
  zoomBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  zoomText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E6EE',
    marginHorizontal: 20,
  },
  sheet: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 10,
  },
  legendItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendSwatch: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendLabel: {
    color: colors.muted,
    fontSize: 13,
  },
  chips: {
    marginTop: 16,
    maxHeight: 44,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipText: {
    color: colors.text,
    fontWeight: '600',
  },
  chipClose: {
    color: colors.muted,
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  totalBox: {
    width: 110,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  totalLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  totalValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  pay: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payDisabled: {
    opacity: 0.45,
  },
  payText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
