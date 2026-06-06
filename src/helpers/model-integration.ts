import { initLlama, LlamaContext } from 'llama.rn';
import { tools, runTool } from './tools';

type Message = {
  role: string;
  content: string;
};

const stopWords = [
  '</s>',
  '<|end|>',
  '<|eot_id|>',
  '<|end_of_text|>',
  '<|im_end|>',
  '<|EOT|>',
  '<|END_OF_TURN_TOKEN|>',
  '<|end_of_turn|>',
  '<|endoftext|>',
];

export function initModel(modelPath: string) {
  return initLlama({
    model: modelPath,
    use_mlock: true,
    n_ctx: 5096,
    n_gpu_layers: 99,
  });
}

const SYSTEM_PROMPT = `
  You are a helpful assistant called Chhotu. Your task is to respond to user politely and with factually correct information.
  Whether you reply or think, also use ENGLISH. Do not use any other language.

  - You also have some tools available for you. Whenever needed run a required tool to get the data.
  - If a tool is available for some usecase, IT MUST BE PREFERRED.
  - Once you get a tool response, use it to generate the final output or more tool calls.
`;

export async function runCompletion(
  model: LlamaContext,
  userPrompt: string,
  onNextTokens: (token: string) => void,
  onDone: () => void,
) {
  const messages: Array<Message> = [
    {
      role: 'system',
      content: SYSTEM_PROMPT,
    },
    {
      role: 'user',
      content: userPrompt,
    },
  ];

  let toolCallResponseProcessing = false;

  while (true) {
    const { tool_calls: toolCalls } = await model.completion(
      {
        messages,
        stop: stopWords,
        tool_choice: 'auto',
        tools,
      },
      data => {
        if (toolCallResponseProcessing) {
          toolCallResponseProcessing = false;
          onNextTokens('<tool_call_response_processing|>');
        }

        const { token } = data;
        onNextTokens(token);
      },
    );

    if (!toolCalls || !toolCalls.length) {
      break;
    }

    // Todo: Fix the types
    const toolRunResponses: {
      tool_calls: Array<unknown>;
      tool_responses: Array<unknown>;
    } = {
      tool_calls: [],
      tool_responses: [],
    };

    for (const toolCall of toolCalls) {
      const args = JSON.parse(toolCall.function.arguments);
      onNextTokens(
        `<|parsed_tool_call>***Tool***: ${
          toolCall.function.name
        }\n***Arguments***: ${JSON.stringify(
          toolCall.function.arguments,
          null,
          2,
        )}\n`,
      );
      const toolResponse = await runTool(toolCall.function.name, args);
      onNextTokens(
        `\n***Response***: ${toolResponse.response}<parsed_tool_call|>`,
      );

      toolRunResponses.tool_calls.push(toolCall);
      toolRunResponses.tool_responses.push({
        name: toolCall.function.name,
        response: toolResponse,
      });
    }

    onNextTokens('<|tool_call_response_processing>');
    toolCallResponseProcessing = true;

    messages.push({
      role: 'assistant',
      content: JSON.stringify(toolRunResponses),
    });
  }

  onDone();
}

export function stopCompletion(model: LlamaContext) {
  return model.stopCompletion();
}
