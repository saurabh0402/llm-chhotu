export type AgentResponse = {
  success: boolean;
  response: string;
};

export type ToolDefs = {
  type: string;
  function: {
    name: string;
    description: string;
    parameters?: {
      type: string;
      properties: Record<
        string,
        {
          type: string;
          description: string;
        }
      >;
      required: Array<string>;
    };
  };
  functionDef: Function;
};
