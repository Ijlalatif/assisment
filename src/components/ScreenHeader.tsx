import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../theme/colors';
import {BackIcon} from './Icons';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

export function ScreenHeader({title, subtitle, onBack}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, {paddingTop: insets.top + 8}]}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
            <BackIcon />
          </Pressable>
        ) : (
          <View style={styles.back} />
        )}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.back} />
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.primary,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 4,
  },
});
