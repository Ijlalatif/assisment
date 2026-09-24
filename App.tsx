import {StatusBar} from 'react-native';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {BookingsProvider} from './src/context/BookingsContext';
import {RootNavigator} from './src/navigation/RootNavigator';
import {colors} from './src/theme/colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
  },
};

function App() {
  return (
    <SafeAreaProvider>
      <BookingsProvider>
        <StatusBar barStyle="dark-content" />
        <NavigationContainer theme={theme}>
          <RootNavigator />
        </NavigationContainer>
      </BookingsProvider>
    </SafeAreaProvider>
  );
}

export default App;
