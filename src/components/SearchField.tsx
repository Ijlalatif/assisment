import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {colors} from '../theme/colors';
import {SearchIcon} from './Icons';

type Props = {
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  onSubmit?: () => void;
  autoFocus?: boolean;
};

export function SearchField({
  value,
  placeholder,
  onChangeText,
  onSubmit,
  autoFocus,
}: Props) {
  return (
    <View style={styles.field}>
      <SearchIcon />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoFocus={autoFocus}
        autoCorrect={false}
      />
      {value.length > 0 ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={8}>
          <TextClear />
        </Pressable>
      ) : null}
    </View>
  );
}

function TextClear() {
  return <View style={styles.clear}><View style={styles.clearLine} /><View style={[styles.clearLine, styles.clearLineAlt]} /></View>;
}

const styles = StyleSheet.create({
  field: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 3,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  clear: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearLine: {
    position: 'absolute',
    width: 14,
    height: 1.5,
    backgroundColor: colors.muted,
    transform: [{rotate: '45deg'}],
  },
  clearLineAlt: {
    transform: [{rotate: '-45deg'}],
  },
});
