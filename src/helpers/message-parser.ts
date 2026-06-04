import { Message, Text } from '../types';

export function getMessageParser(modelName: string) {
  if (modelName === 'gemma4') {
    return gemma4Parser;
  }

  return defaultParser;
}

function defaultParser(token: string, message: Message): Message {
  const content = message.content;
  if (!content[0]) {
    content.push({
      type: 'message',
      content: '',
    });
  }

  content[0].content += token;

  return {
    ...message,
    content,
  };
}

function gemma4Parser(token: string, message: Message): Message {
  // Writing a simplistic logic right now to get things
  // working. We would have to consider the case where
  // the channel details come in different tokens and
  // not in a single one

  const channelStartMsg = '<|channel>';
  const channelEndMsg = '<channel|>';
  const channelName = 'thought';

  const channelIndex = token.indexOf(channelStartMsg);
  const channelCloseIndex = token.indexOf(channelEndMsg);

  let stillThinking =
    message.content[0]?.type === 'reasoning' &&
    !message.content[0].thinkingDone;

  if (channelIndex !== -1) {
    const restOfMessage = token
      .slice(channelIndex + channelStartMsg.length + 1)
      .trim();

    const newText: Text = {
      type: 'reasoning',
      content: '',
      thinkingDone: false,
    };

    const newMessage = {
      ...message,
      content: [newText].concat(message.content),
    };

    return gemma4Parser(restOfMessage, newMessage);
  } else if (channelCloseIndex !== -1) {
    const restOfMessage = token
      .slice(channelIndex + channelEndMsg.length + 1)
      .trim();

    message.content[0].thinkingDone = true;
    return gemma4Parser(restOfMessage, message);
  } else if (token.startsWith(channelName) && stillThinking) {
    const restOfMessage = token.slice(channelName.length + 1);

    message.content[0].content += restOfMessage;
    return message;
  }

  if (
    message.content[0].type === 'reasoning' &&
    !message.content[0].thinkingDone
  ) {
    message.content[0].content += token;
    return message;
  }

  if (message.content[0].type !== 'message') {
    const newMessage: Text = {
      type: 'message',
      content: token,
    };

    return {
      ...message,
      content: [newMessage].concat(message.content),
    };
  }

  message.content[0].content += token;
  return message;
}
