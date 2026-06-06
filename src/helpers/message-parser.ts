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

  if (!token) {
    return message;
  }

  const channelStartMsg = '<|channel>';
  const channelEndMsg = '<channel|>';
  const toolCallStartMsg = '<|tool_call>';
  const toolCallEndMsg = '<tool_call|>';
  const parsedToolCallStartMsg = '<|parsed_tool_call>';
  const parsedToolCallEndMsg = '<parsed_tool_call|>';
  const toolResponseProcessingStartMsg = '<|tool_call_response_processing>';
  const toolResponseProcessingEndMsg = '<tool_call_response_processing|>';
  const channelName = 'thought';

  const channelIndex = token.indexOf(channelStartMsg);
  const channelCloseIndex = token.indexOf(channelEndMsg);
  const toolCallIndex = token.indexOf(toolCallStartMsg);
  const toolCallEndIndex = token.indexOf(toolCallEndMsg);
  const parsedToolCallIndex = token.indexOf(parsedToolCallStartMsg);
  const parsedToolCallEndIndex = token.indexOf(parsedToolCallEndMsg);
  const toolResponseStartIndex = token.indexOf(toolResponseProcessingStartMsg);
  const toolResponseEndIndex = token.indexOf(toolResponseProcessingEndMsg);

  console.log(token, toolResponseStartIndex, toolResponseEndIndex);

  let stillThinking =
    message.content[0]?.type === 'reasoning' && !message.content[0].done;

  if (channelIndex !== -1) {
    const restOfMessage = token
      .slice(channelIndex + channelStartMsg.length + 1)
      .trim();

    const newText: Text = {
      type: 'reasoning',
      content: '',
      done: false,
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

    message.content[0].done = true;
    return gemma4Parser(restOfMessage, message);
  } else if (token.startsWith(channelName) && stillThinking) {
    const restOfMessage = token.slice(channelName.length + 1);

    message.content[0].content += restOfMessage;
    return message;
  } else if (toolCallIndex !== -1) {
    const newText: Text = {
      type: 'llmToolCall',
      content: '',
      done: false,
    };

    return {
      ...message,
      content: [newText].concat(message.content),
    };
  } else if (toolCallEndIndex !== -1) {
    const restOfMessage = token
      .slice(toolCallEndIndex + toolCallEndMsg.length + 1)
      .trim();

    message.content[0].done = true;
    return gemma4Parser(restOfMessage, message);
  } else if (parsedToolCallIndex !== -1) {
    const restOfMessage = token
      .slice(parsedToolCallIndex + parsedToolCallStartMsg.length)
      .trim();

    const newText: Text = {
      type: 'parsedToolCall',
      content: restOfMessage,
      done: false,
    };

    return {
      ...message,
      content: [newText].concat(message.content),
    };
  } else if (parsedToolCallEndIndex !== -1) {
    const responseData = token.slice(0, parsedToolCallEndIndex);
    message.content[0].content += responseData;
    message.content[0].done = true;
    return message;
  } else if (toolResponseStartIndex !== -1) {
    const newText: Text = {
      type: 'toolResponseProcessing',
      content: '',
      done: false,
    };

    return {
      ...message,
      content: [newText].concat(message.content),
    };
  } else if (toolResponseEndIndex !== -1) {
    message.content[0].done = true;
    return message;
  }

  if (message.content[0].type === 'reasoning' && !message.content[0].done) {
    message.content[0].content += token;
    return message;
  }

  if (message.content[0].type === 'llmToolCall' && !message.content[0].done) {
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
