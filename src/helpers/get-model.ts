import {
  DocumentDirectoryPath,
  exists,
  mkdir,
  downloadFile,
  unlink,
} from '@dr.pogodin/react-native-fs';

import {
  createDownloadTask,
  getExistingDownloadTasks,
} from '@kesha-antonov/react-native-background-downloader';

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

      getExistingDownloadTasks().then(tasks => {
        let task = tasks[0];

        if (!task) {
          task = createDownloadTask({
            url: modelUrl,
            destination: modelFilePath,
            id: modelName,
          });
        }

        task
          .progress(({ bytesDownloaded, bytesTotal }) => {
            onProgress(bytesDownloaded / bytesTotal);
          })
          .done(() => {
            onDone(modelFilePath);
          })
          .error(err => {
            onError(err.error || 'Failed to Download model');
          });

        task.start();
      });
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
