import { initLlama, LlamaContext } from 'llama.rn';
import { tools } from './tools';

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
    n_ctx: 2048,
    n_gpu_layers: 99,
  });
}

const SYSTEM_PROMPT = `
  You are a helpful assistant called Chhotu. Your task is to respond to user politely and with factually correct information.
  Whether you reply or think, also use ENGLISH. Do not use any other language.

  - You also have some tools available for you. Whenever needed run a required tool to get the data.
  - If a tool is available for some usecase, IT MUST BE PREFERRED.
  - Once you get a tool response, use it to generate the final output or more tool cools.
`;

export async function runCompletion(
  model: LlamaContext,
  userPrompt: string,
  onNextTokens: (token: string) => void,
  onDone: () => void,
) {
  const { tool_calls } = await model.completion(
    {
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      stop: stopWords,
      tool_choice: 'auto',
      tools,
    },
    data => {
      const { token } = data;
      onNextTokens(token);
    },
  );

  console.log(tool_calls);

  onDone();
}

export function stopCompletion(model: LlamaContext) {
  return model.stopCompletion();
}
