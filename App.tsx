/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

import { ModelDownload } from './src/components';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [modelPath, setModelPath] = useState<string>('');

  return (
    <View style={styles.container}>
      {
        <View style={styles.downloadContainer}>
          <ModelDownload setModelPath={setModelPath} />
        </View>
      }
      {modelPath && (
        <Text style={styles.fileItem}>
          Wohooo! Model Downloaded - {modelPath}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Number(StatusBar.currentHeight) + 20,
    paddingHorizontal: 20,
  },
  downloadContainer: {
    height: 200,
    padding: 10,
  },
  fileItem: {
    color: 'white',
    fontSize: 16,
    marginVertical: 8,
  },
});

export default App;
