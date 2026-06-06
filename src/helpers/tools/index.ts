import * as maths from './weather';
import * as web from './web';
import { AgentResponse } from './types';

let toolDefs = web.toolDefs;

export const tools = toolDefs.map(toolDef => ({
  ...toolDef,
  function: {
    ...toolDef.function,
    returns: {
      success: 'Whether the tool call was successful or not',
      response: 'Final result of the tool call',
    },
  },
  function_def: null,
}));

export async function runTool(
  name: string,
  args: Object,
): Promise<AgentResponse> {
  const toolToRun = toolDefs.find(tool => tool.function.name === name);

  if (!toolToRun) {
    return {
      success: false,
      response: 'Tool not found',
    };
  }

  try {
    const response = await toolToRun.functionDef(args as unknown);
    return {
      success: true,
      response: JSON.stringify(response),
    };
  } catch (err) {
    return {
      success: false,
      response: (err as Error).message || 'Tool call failed',
    };
  }
}
