export type Message = {
  sender: 'user' | 'bot';
  content: Array<Text>;
};

export type Text = {
  type:
    | 'reasoning'
    | 'message'
    | 'llmToolCall'
    | 'parsedToolCall'
    | 'toolResponseProcessing';
  content: string;
  done?: boolean;
};
