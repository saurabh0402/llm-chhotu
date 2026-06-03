import { ToolDefs } from './types';

async function getWeather(): Promise<string> {
  return 'it is sunny with 20 degress centigrade';
}

export const toolDefs: Array<ToolDefs> = [
  {
    type: 'function',
    function: {
      name: 'getWeather',
      description: 'Get the current weather for the user',
      // parameters: {
      //   type: 'object',
      //   properties: {
      //     x:   { type: 'number', description: 'First number to multiply' },
      //     y: { type: 'number', description: 'Second number to multiply' },
      //   },
      //   required: ['x', 'y'],
      // },
    },
    functionDef: getWeather,
  },
];
