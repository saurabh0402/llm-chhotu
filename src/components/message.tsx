import { StyleSheet, View, Text } from 'react-native';
import Markdown from 'react-native-marked';

type MessageProps = {
  content: string;
  sender: 'bot' | 'user';
};

const MARKDOWN_FLAT_LIST_PROPS = {
  style: { backgroundColor: 'transparent' },
};

export function MessageRenderer({ content, sender }: MessageProps) {
  if (!content) {
    return null;
  }

  if (sender === 'user') {
    return (
      <View style={styles.userMessageContainer}>
        <View style={styles.userMarkdownContainer}>
          <Markdown value={content} flatListProps={MARKDOWN_FLAT_LIST_PROPS} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.botMessageContainer}>
      <Markdown value={content} flatListProps={MARKDOWN_FLAT_LIST_PROPS} />
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
  },
  botMessageContainer: {
    flex: 1,
    padding: 10,
  },
  botMessage: {
    color: '#d8e5f3',
  },
});
