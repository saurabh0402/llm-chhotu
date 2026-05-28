import { StyleSheet, View, Text } from 'react-native';
import Markdown from 'react-native-marked';
import { UserTheme } from 'react-native-marked/dist/typescript/theme/types';

import { ThinkingMessage } from '.';

type MessageProps = {
  content: string;
  sender: 'bot' | 'user';
  thinkingInProgress: boolean;
  thinkingMsg: string;
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

const MARKDOWN_THEME_THINKING: UserTheme = {
  colors: {
    code: '#6399cf',
    link: '#6399cf',
    text: '#6399cf',
    border: '#6399cf',
  },
};

export function MessageRenderer({
  content,
  sender,
  thinkingMsg,
  thinkingInProgress,
}: MessageProps) {
  if (!content && !thinkingMsg) {
    return null;
  }

  if (sender === 'user') {
    return (
      <View style={styles.userMessageContainer}>
        <View style={styles.userMarkdownContainer}>
          <Markdown
            value={content}
            flatListProps={MARKDOWN_FLAT_LIST_PROPS}
            theme={MARKDOWN_THEME_MESSAGE}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.botMessageContainer}>
      {thinkingMsg && (
        <ThinkingMessage
          thinkingInProgress={thinkingInProgress}
          thinkingMessage={thinkingMsg}
        />
      )}
      <Markdown
        value={content}
        flatListProps={MARKDOWN_FLAT_LIST_PROPS}
        theme={MARKDOWN_THEME_MESSAGE}
      />
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
