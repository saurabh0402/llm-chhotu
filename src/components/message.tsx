import { StyleSheet, View, Text } from 'react-native';
import Markdown from 'react-native-marked';
import { UserTheme } from 'react-native-marked/dist/typescript/theme/types';

import { CollapsibleMessage } from '.';
import { Message } from '../types';

export type RendererProps = {
  message: Message;
};

const MARKDOWN_FLAT_LIST_PROPS = {
  style: { backgroundColor: 'transparent' },
};

const MARKDOWN_THEME_MESSAGE: UserTheme = {
  colors: {
    code: '#c5d9ed',
    link: '#c5d9ed',
    text: '#c5d9ed',
    border: '#c5d9ed',
  },
};

export function MessageRenderer({ message }: RendererProps) {
  const { sender, content } = message;

  if (sender === 'user') {
    return (
      <View style={styles.userMessageContainer}>
        <View style={styles.userMarkdownContainer}>
          <Markdown
            value={content[0].content}
            flatListProps={MARKDOWN_FLAT_LIST_PROPS}
            theme={MARKDOWN_THEME_MESSAGE}
            styles={{
              codespan: {
                backgroundColor: 'rgba(0,0,0,0.5)',
              },
            }}
          />
        </View>
      </View>
    );
  }

  if (!content?.length) {
    return (
      <View style={styles.botMessageContainer}>
        <Markdown
          value="*Processing Request...*"
          flatListProps={MARKDOWN_FLAT_LIST_PROPS}
          theme={MARKDOWN_THEME_MESSAGE}
        />
      </View>
    );
  }

  return (
    <View style={styles.botMessageContainer}>
      {[...content].reverse().map((singleText, i) => {
        const { type, content, done } = singleText;

        if (type === 'reasoning') {
          return (
            <CollapsibleMessage
              inProgress={!done}
              message={content}
              key={`${message}-${i}`}
              title="🤔 Reasoning"
            />
          );
        } else if (type === 'message') {
          return (
            <Markdown
              value={content}
              flatListProps={MARKDOWN_FLAT_LIST_PROPS}
              theme={MARKDOWN_THEME_MESSAGE}
              key={`${message}-${i}`}
              styles={{
                codespan: {
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
              }}
            />
          );
        } else if (type === 'parsedToolCall') {
          return (
            <CollapsibleMessage
              inProgress={!done}
              message={content}
              key={`${message}-${i}`}
              title="🛠️ Running Tool"
            />
          );
        } else if (type === 'toolResponseProcessing') {
          return (
            <CollapsibleMessage
              inProgress={!done}
              message={content}
              key={`${message}-${i}`}
              title="🤖 Processing Tool Response"
              isCollapsible={false}
            />
          );
        }

        return null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  userMessageContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  userMarkdownContainer: {
    width: '70%',
    backgroundColor: 'rgb(37, 77, 116)',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  botMessageContainer: {
    flex: 1,
    padding: 10,
  },
  botMessage: {
    color: '#d8e5f3',
  },
});
