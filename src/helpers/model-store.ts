import { DocumentDirectoryPath } from '@dr.pogodin/react-native-fs';

export function getModelFolder() {
  return `${DocumentDirectoryPath}/models`;
}

export function getModelFilePath(modelName: string) {
  return `${getModelFolder()}/${modelName}.gguf`;
}
