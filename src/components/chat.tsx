import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  FlatList,
  TextInput,
  Button,
} from 'react-native';
import { useEffect, useState } from 'react';
import { LlamaContext } from 'llama.rn';

import { initModel, runCompletion } from '../helpers';
import { useBehavior } from '../hooks';

type ChatProps = {
  modelPath: string;
  setModelPath: (path: string | null) => void;
};

export function Chat({ modelPath, setModelPath }: ChatProps) {
  const [llmContext, setLlmContext] = useState<LlamaContext | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [llmData, setLlmData] = useState('');

  const behavior = useBehavior();

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

  // useEffect(() => {
  //   if (!llmContext) {
  //     return;
  //   }

  //   runCompletion(
  //     llmContext,
  //     token => {
  //       setLlmData(data => data + token);
  //     },
  //     () => {},
  //   );
  // }, [llmContext]);

  if (!modelReady) {
    return <Text style={styles.text}>Loading Model...</Text>;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={0}
      behavior={behavior}
    >
      <FlatList
        data={[
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Moseley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.",
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Moseley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.",
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Moseley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.",
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Moseley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.",
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Moseley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.",
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Moseley, the librarian at St Bride Printing Library, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software including versions of Lorem Ipsum.",
        ]}
        renderItem={({ item }) => {
          return <Text style={{ color: 'white' }}>{item}</Text>;
        }}
        style={styles.messagesContainer}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} multiline={true} />
        <View style={styles.buttonsContainer}>
          <Button title="➤" color="#32669a" />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 25,
  },
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
  messagesContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: 'white',
    flex: 1,
    borderRadius: 10,
    height: 100,
    textAlignVertical: 'top',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  buttonsContainer: {
    padding: 10,
    alignContent: 'center',
  },
});
