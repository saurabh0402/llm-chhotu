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

import {
  initModel,
  runCompletion,
  stopCompletion,
  getMessageParser,
} from '../helpers';
import { useBehavior } from '../hooks';
import { MessageRenderer, FullScreenLoader } from '.';
import { Message, Text as TextType } from '../types';

type ChatProps = {
  modelPath: string;
  setModelPath: (path: string | null) => void;
  modelName: string;
};

export function Chat({ modelPath, setModelPath, modelName }: ChatProps) {
  const [llmContext, setLlmContext] = useState<LlamaContext | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [curInput, setCurInput] = useState('');
  const [modelInProgress, setModelInProgress] = useState(false);
  const behavior = useBehavior();
  const parser = getMessageParser(modelName);

  useEffect(() => {
    async function init() {
      try {
        const context = await initModel(modelPath);
        setLlmContext(context);
        setModelReady(true);
      } catch (err) {
        console.log(err);
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
      const newMessages: Array<Message> = [
        {
          content: [] as Array<TextType>,
          sender: 'bot' as const,
        },
        {
          sender: 'user' as const,
          content: [
            {
              type: 'message' as const,
              content: userPrompt,
            },
          ],
        },
      ];

      return newMessages.concat(existingMessages);
    });
    setCurInput('');
    setModelInProgress(true);

    runCompletion(
      llmContext,
      userPrompt,
      token => {
        setMessages(existingMessages => {
          const newMessages = [...existingMessages];
          newMessages[0] = parser(token, newMessages[0]);
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
          return <MessageRenderer message={item} />;
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
