/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, Text, useColorScheme, View, FlatList } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {
  readDir,
  DocumentDirectoryPath,
  ExternalStorageDirectoryPath,
} from '@dr.pogodin/react-native-fs';
import { useEffect, useState } from 'react';

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
  const [files, setFiles] = useState<Array<string>>([]);
  const [curPath, setCurPath] = useState<string>(ExternalStorageDirectoryPath);

  useEffect(() => {
    readDir(curPath).then((result) => {
      setFiles(result.map(r => r.path));
    });
  }, [curPath]);

  function getNewPath(path: string) {
    if (path === '..') {
      const splitted = curPath.split('/');
      return splitted.slice(0, splitted.length - 1).join('/');
    }

    return path;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={['..'].concat(files)}
        renderItem={({item}) => <Text style={styles.fileItem} onPress={() => setCurPath(getNewPath(item))}>{item}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: 20,
  },
  fileItem: {
    color: 'white',
    fontSize: 16,
    marginVertical: 8,
  }
});

export default App;
