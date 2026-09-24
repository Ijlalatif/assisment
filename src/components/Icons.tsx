import {StyleSheet, View} from 'react-native';
import {colors} from '../theme/colors';

export function BackIcon() {
  return (
    <View style={styles.chevronWrap}>
      <View style={styles.chevron} />
    </View>
  );
}

export function SearchIcon() {
  return (
    <View style={styles.searchWrap}>
      <View style={styles.searchCircle} />
      <View style={styles.searchHandle} />
    </View>
  );
}

export function PlayIcon({active}: {active?: boolean}) {
  return <View style={[styles.play, active && styles.playActive]} />;
}

export function GridIcon({active}: {active?: boolean}) {
  const tone = active ? styles.dotActive : styles.dot;
  return (
    <View style={styles.grid}>
      <View style={styles.gridRow}>
        <View style={[styles.gridDot, tone]} />
        <View style={[styles.gridDot, tone]} />
      </View>
      <View style={styles.gridRow}>
        <View style={[styles.gridDot, tone]} />
        <View style={[styles.gridDot, tone]} />
      </View>
    </View>
  );
}

export function LibraryIcon({active}: {active?: boolean}) {
  const tone = active ? styles.strokeActive : styles.stroke;
  return (
    <View style={styles.library}>
      <View style={[styles.libraryTop, tone]} />
      <View style={[styles.libraryBody, tone]} />
    </View>
  );
}

export function MoreIcon({active}: {active?: boolean}) {
  const tone = active ? styles.barActive : styles.bar;
  return (
    <View style={styles.more}>
      <View style={[styles.barLine, tone]} />
      <View style={[styles.barLine, styles.barShort, tone]} />
      <View style={[styles.barLine, tone]} />
    </View>
  );
}

const styles = StyleSheet.create({
  chevronWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.text,
    transform: [{rotate: '45deg'}],
    marginLeft: 4,
  },
  searchWrap: {
    width: 18,
    height: 18,
  },
  searchCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.6,
    borderColor: colors.muted,
  },
  searchHandle: {
    position: 'absolute',
    width: 6,
    height: 1.6,
    backgroundColor: colors.muted,
    right: 0,
    bottom: 2,
    transform: [{rotate: '45deg'}],
  },
  play: {
    width: 0,
    height: 0,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.navInactive,
    marginLeft: 2,
  },
  playActive: {
    borderLeftColor: colors.white,
  },
  grid: {
    width: 16,
    height: 16,
    justifyContent: 'space-between',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridDot: {
    width: 6,
    height: 6,
    borderRadius: 2,
  },
  dot: {
    backgroundColor: colors.navInactive,
  },
  dotActive: {
    backgroundColor: colors.white,
  },
  library: {
    width: 16,
    height: 16,
    justifyContent: 'flex-end',
  },
  libraryTop: {
    width: 8,
    height: 3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderWidth: 1.4,
    borderBottomWidth: 0,
    marginLeft: 1,
  },
  libraryBody: {
    width: 16,
    height: 10,
    borderWidth: 1.4,
    borderRadius: 2,
  },
  stroke: {
    borderColor: colors.navInactive,
  },
  strokeActive: {
    borderColor: colors.white,
  },
  more: {
    width: 16,
    height: 14,
    justifyContent: 'space-between',
  },
  barLine: {
    height: 1.6,
    borderRadius: 1,
    width: 16,
  },
  barShort: {
    width: 12,
  },
  bar: {
    backgroundColor: colors.navInactive,
  },
  barActive: {
    backgroundColor: colors.white,
  },
});
