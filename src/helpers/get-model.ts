import {
  DocumentDirectoryPath,
  exists,
  mkdir,
  downloadFile,
  unlink,
} from '@dr.pogodin/react-native-fs';

const MODEL_NAME_TO_HUGGINGFACE_MAPPER: Record<string, string> = {
  gemma4: 'unsloth/gemma-4-E2B-it-GGUF',
};

const MODEL_NAME_TO_HUGGINGFACE_FILE_NAME: Record<string, string> = {
  gemma4: 'gemma-4-E2B-it-UD-IQ2_M.gguf',
};

export function getModel(
  modelName: string,
  onProgress: (percent: number) => void,
  onDone: (filePath: string) => void,
  onError: (error: string) => void,
) {
  const modelFolder = getModelFolder();
  const modelFilePath = getModelFilePath(modelName);
  const modelUrl = getModelUrl(modelName);

  mkdir(modelFolder).then(() => {
    exists(modelFilePath).then(fileExists => {
      if (fileExists) {
        unlink(modelFilePath).then(() => {});
      }

      const { promise } = downloadFile({
        fromUrl: modelUrl,
        toFile: modelFilePath,
        progress: ({ contentLength, bytesWritten }) => {
          onProgress(bytesWritten / contentLength);
        },
      });

      promise
        .then(res =>
          res.statusCode === 200
            ? onDone(modelFilePath)
            : onError('Failed to Download'),
        )
        .catch(err => onError(err.message || 'Failed to Download'));
    });
  });
}

function getModelUrl(modelName: string) {
  const huggingFaceName = MODEL_NAME_TO_HUGGINGFACE_MAPPER[modelName];
  const huggingFaceFileName = MODEL_NAME_TO_HUGGINGFACE_FILE_NAME[modelName];

  if (!huggingFaceName) {
    throw new Error('Invalid Model Name');
  }

  return `https://huggingface.co/${huggingFaceName}/resolve/main/${huggingFaceFileName}?download=true`;
}

function getModelFolder() {
  return `${DocumentDirectoryPath}/models`;
}

function getModelFilePath(modelName: string) {
  return `${getModelFolder()}/${modelName}.gguf`;
}
