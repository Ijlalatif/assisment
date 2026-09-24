import {StyleSheet, View} from 'react-native';

type Props = {
  color: string;
  size?: number;
};

export function CinemaSeat({color, size = 16}: Props) {
  const backWidth = size * 0.86;
  const arm = size * 0.18;
  const cushion = size * 0.5;

  return (
    <View style={{width: size, height: size * 1.05, alignItems: 'center'}}>
      <View
        style={{
          width: backWidth,
          height: size * 0.4,
          backgroundColor: color,
          borderTopLeftRadius: size * 0.24,
          borderTopRightRadius: size * 0.24,
          borderBottomLeftRadius: 1,
          borderBottomRightRadius: 1,
        }}
      />
      <View style={styles.base}>
        <View
          style={{
            width: arm,
            height: size * 0.48,
            backgroundColor: color,
            borderBottomLeftRadius: size * 0.12,
          }}
        />
        <View
          style={{
            width: cushion,
            height: size * 0.36,
            backgroundColor: color,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
            marginTop: size * 0.1,
          }}
        />
        <View
          style={{
            width: arm,
            height: size * 0.48,
            backgroundColor: color,
            borderBottomRightRadius: size * 0.12,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 1,
  },
});
