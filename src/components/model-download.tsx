import { useState } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';

import { getModel } from '../helpers';

type ModelDownloadProps = {
  modelPath: string | null;
  setModelPath: (path: string | null) => void;
  modelName: string;
};

export function ModelDownload({
  modelPath,
  setModelPath,
  modelName,
}: ModelDownloadProps) {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  function downloadModel() {
    setDownloading(true);
    setModelPath(null);

    getModel(
      modelName,
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

  function getDownloadPercent() {
    return (progress * 100).toFixed(2);
  }

  return (
    <View style={styles.mainView}>
      <View style={styles.modelDetailsContainer}>
        {modelPath ? (
          <>
            <Text style={styles.modelDetails}>Loaded Model: </Text>
            <Text style={styles.modelName}>{modelName}</Text>
          </>
        ) : (
          <Text style={styles.modelDetails}>No Model Downloaded yet.</Text>
        )}
      </View>
      {!downloading ? (
        <Text style={styles.reDownloadButton} onPress={downloadModel}>
          {modelPath ? 'Re-download Model' : 'Download Model'}
        </Text>
      ) : (
        <Text style={styles.downloadingStatus}>
          Downloading ({getDownloadPercent()}%)
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    // height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 89, 134, 0.5)',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  modelDetailsContainer: {
    flexDirection: 'row',
  },
  modelDetails: {
    fontSize: 14,
    color: 'white',
  },
  modelName: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  reDownloadButton: {
    color: 'white',
    backgroundColor: 'rgb(25, 51, 77)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  downloadingStatus: {
    color: 'white',
    backgroundColor: 'rgba(57, 172, 57, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
});
