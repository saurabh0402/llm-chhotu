import { initLlama, LlamaContext } from 'llama.rn';

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

export async function runCompletion(
  model: LlamaContext,
  onNextTokens: (token: string) => void,
  onDone: () => void,
) {
  console.log('Running Completion!');

  await model.completion(
    {
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant called Chhotu. Your task is to respond to user politely and with factually correct information.',
        },
        {
          role: 'user',
          content: 'hello',
        },
      ],
      stop: stopWords,
    },
    data => {
      console.log(data);
      const { token } = data;
      onNextTokens(token);
    },
  );

  onDone();
}
