type ParserResponse = {
  toggleThinking: boolean;
  content: string;
};

export function getMessageParser(modelName: string) {
  if (modelName === 'gemma4') {
    return gemma4Parser;
  }

  return defaultParser;
}

function defaultParser(
  token: string,
  content: string,
  thinkingMsg: string,
): ParserResponse {
  return {
    toggleThinking: false,
    content: token,
  };
}

function gemma4Parser(
  token: string,
  content: string,
  thinkingMsg: string,
): ParserResponse {
  // Writing a simplistic logic right now to get things
  // working. We would have to consider the case where
  // the channel details come in different tokens and
  // not in a single one

  const channelStartMsg = '<|channel>';
  const channelEndMsg = '<channel|>';
  const channelName = 'thought';

  const channelIndex = token.indexOf(channelStartMsg);
  const channelCloseIndex = token.indexOf(channelEndMsg);

  if (channelIndex !== -1) {
    const restOfMessage = token
      .slice(channelIndex + channelStartMsg.length + 1)
      .trim();

    return {
      toggleThinking: true,
      content: restOfMessage,
    };
  } else if (channelCloseIndex !== -1) {
    const restOfMessage = token
      .slice(channelIndex + channelEndMsg.length + 1)
      .trim();

    return {
      toggleThinking: true,
      content: restOfMessage,
    };
  } else if (token.startsWith(channelName) && !thinkingMsg) {
    const restOfMessage = token.slice(channelName.length + 1);

    return {
      toggleThinking: false,
      content: restOfMessage,
    };
  }

  return {
    toggleThinking: false,
    content: token,
  };
}
