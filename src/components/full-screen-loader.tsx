import { StyleSheet, Text, View } from 'react-native';
import { CircleSnail } from 'react-native-progress';

type FullScreenLoaderProps = {
  message: string;
};

export function FullScreenLoader({ message }: FullScreenLoaderProps) {
  return (
    <View style={styles.container}>
      <CircleSnail
        indeterminate={true}
        color="#4f8ac9"
        size={70}
        thickness={5}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#9dbee1',
    fontWeight: 'bold',
    marginTop: 20,
  },
});
