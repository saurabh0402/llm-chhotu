import { StyleSheet, View, Text } from 'react-native';

type MessageProps = {
  content: string;
  sender: 'bot' | 'user';
};

export function MessageRenderer({ content, sender }: MessageProps) {
  if (!content) {
    return null;
  }

  if (sender === 'user') {
    return (
      <View style={styles.userMessageContainer}>
        <Text style={styles.userMessage}>{content}</Text>
      </View>
    );
  }

  return (
    <View style={styles.botMessageContainer}>
      <Text style={styles.botMessage}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  userMessageContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    padding: 10,
  },
  userMessage: {
    width: '70%',
    backgroundColor: 'rgb(37, 77, 116)',
    color: 'white',
    padding: 10,
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
