import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Collapsible } from 'react-native-fast-collapsible';
import Markdown from 'react-native-marked';
import { UserTheme } from 'react-native-marked/dist/typescript/theme/types';
import { Circle } from 'react-native-progress';

export type CollapsibleMessageProps = {
  message: string;
  inProgress: boolean;
  title?: string;
};

const MARKDOWN_FLAT_LIST_PROPS = {
  style: { backgroundColor: 'transparent', paddingTop: 10 },
};

const MARKDOWN_THEME_THINKING: UserTheme = {
  colors: {
    code: 'rgb(79, 140, 201)',
    link: 'rgb(79, 140, 201)',
    text: 'rgb(128, 128, 128)',
    border: 'rgb(79, 140, 201)',
  },
};

export function CollapsibleMessage({
  message,
  inProgress,
  title = 'Reasoning',
}: CollapsibleMessageProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setIsCollapsed(collapsed => !collapsed)}>
        <View style={styles.header}>
          <View style={styles.headerState}>
            <Text style={{ ...styles.headerText, marginRight: 10 }}>
              {title}
            </Text>
            {inProgress ? (
              <Circle
                indeterminate={true}
                color="rgb(153, 153, 153)"
                size={10}
                thickness={5}
              />
            ) : (
              <Text style={styles.headerText}>✔</Text>
            )}
          </View>
          <Text style={styles.headerText}>{isCollapsed ? '▼' : '▲'}</Text>
        </View>
      </Pressable>
      <Collapsible isVisible={isCollapsed}>
        <Markdown
          value={message}
          flatListProps={MARKDOWN_FLAT_LIST_PROPS}
          theme={MARKDOWN_THEME_THINKING}
        />
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: 'rgb(24, 51, 78)',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  headerState: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    color: 'rgb(153, 153, 153)',
  },
});
