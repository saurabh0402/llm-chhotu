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

import { initModel, runCompletion, stopCompletion } from '../helpers';
import { useBehavior } from '../hooks';
import { MessageRenderer, FullScreenLoader } from '.';

type ChatProps = {
  modelPath: string;
  setModelPath: (path: string | null) => void;
};

type Message = {
  content: string;
  sender: 'user' | 'bot';
};

export function Chat({ modelPath, setModelPath }: ChatProps) {
  const [llmContext, setLlmContext] = useState<LlamaContext | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [curInput, setCurInput] = useState('');
  const [modelInProgress, setModelInProgress] = useState(false);
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

  function sendMessage() {
    if (!llmContext) {
      return;
    }

    const userPrompt = curInput;
    setMessages(existingMessages => {
      return [
        {
          content: '',
          sender: 'bot' as const,
        },
        {
          content: userPrompt,
          sender: 'user' as const,
        },
      ].concat(existingMessages);
    });
    setCurInput('');
    setModelInProgress(true);

    runCompletion(
      llmContext,
      userPrompt,
      token => {
        setMessages(existingMessages => {
          const newMessages = [...existingMessages];
          newMessages[0].content = newMessages[0].content + token;
          return newMessages;
        });
      },
      () => {
        setModelInProgress(false);
      },
    );
  }

  function stopGeneration() {
    if (!llmContext) {
      return;
    }

    stopCompletion(llmContext);
  }

  if (!modelReady) {
    return <FullScreenLoader message="Initialising Model" />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset={0}
      behavior={behavior}
    >
      <FlatList
        data={messages}
        renderItem={({ item }) => {
          return <MessageRenderer {...item} />;
        }}
        style={styles.messagesContainer}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline={true}
          value={curInput}
          onChangeText={setCurInput}
          placeholder="Ask something..."
        />
        <View style={styles.buttonsContainer}>
          <Button
            title={modelInProgress ? '⊘' : '➤'}
            color="#32669a"
            onPress={modelInProgress ? stopGeneration : sendMessage}
          />
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
