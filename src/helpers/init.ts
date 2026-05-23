import { exists } from '@dr.pogodin/react-native-fs';
import { getModelFilePath } from './model-store';

export async function initApp(modelName: string) {
  const modelPath = getModelFilePath(modelName);
  if (await exists(modelPath)) {
    return modelPath;
  }

  return null;
}
