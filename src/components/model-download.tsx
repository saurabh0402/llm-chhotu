import { useState } from 'react';
import { Circle } from 'react-native-progress';
import { StyleSheet, View, Button } from 'react-native';

import { getModel } from '../helpers';

type ModelDownloadProps = {
  setModelPath: (path: string) => void;
};

export function ModelDownload({ setModelPath }: ModelDownloadProps) {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  function downloadModel() {
    setDownloading(true);

    getModel(
      'gemma4',
      setProgress,
      data => {
        setModelPath(data);
        setDownloading(false);
      },
      err => {
        setError(err);
        setDownloading(false);
      },
    );
  }

  return (
    <View style={styles.mainView}>
      {!downloading && (
        <Button title="Download Model" onPress={downloadModel} />
      )}
      {downloading && (
        <View style={styles.loader}>
          <Circle
            size={100}
            thickness={5}
            showsText={true}
            progress={progress}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
