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

import { ModelDownload, Chat } from './src/components';
import { initApp } from './src/helpers';

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
  const [modelName] = useState('gemma4');
  const [modelPath, setModelPath] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const modelPath = await initApp(modelName);
      setModelPath(modelPath);
    }

    init();
  }, [modelName]);

  return (
    <View style={styles.container}>
      {
        <View style={styles.downloadContainer}>
          <ModelDownload setModelPath={setModelPath} modelName={modelName} />
        </View>
      }
      {modelPath && <Chat modelPath={modelPath} />}
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
});

export default App;
