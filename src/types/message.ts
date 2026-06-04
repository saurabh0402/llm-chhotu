export type Message = {
  sender: 'user' | 'bot';
  content: Array<Text>;
};

export type Text = {
  type: 'reasoning' | 'message';
  content: string;
  thinkingDone?: boolean;
};
