import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { LlamaContext } from 'llama.rn';

import { initModel, runCompletion } from '../helpers';

type ChatProps = {
  modelPath: string;
  setModelPath: (path: string | null) => void;
};

export function Chat({ modelPath, setModelPath }: ChatProps) {
  const [llmContext, setLlmContext] = useState<LlamaContext | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [llmData, setLlmData] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const context = await initModel(modelPath);
        setLlmContext(context);
        setModelReady(true);
      } catch (err) {
        setModelPath(null);
      }
    }

    init();
  }, []);

  useEffect(() => {
    if (!llmContext) {
      return;
    }

    runCompletion(
      llmContext,
      token => {
        setLlmData(data => data + token);
      },
      () => {},
    );
  }, [llmContext]);

  if (!modelReady) {
    return <Text style={styles.text}>Loading Model...</Text>;
  }

  return (
    <>
      <Text style={styles.text}>Woohooo! Model Loaded! Running Test Now</Text>
      <View style={styles.llmTestResponseView}>
        <Text style={styles.llmTestResponseText}>{llmData}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 20,
  },
  llmTestResponseView: {
    padding: 10,
  },
  llmTestResponseText: {
    fontSize: 16,
    color: 'white',
  },
});
