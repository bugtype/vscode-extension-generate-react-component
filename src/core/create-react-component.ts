import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import path from 'path';
import { AVAILABLE_REACT_ELEMENTS } from './const';
import { InputValidationError, FileAlreadyExistsError } from './error';

type AvailableElement = keyof typeof AVAILABLE_REACT_ELEMENTS;

const htmlTemplates = AVAILABLE_REACT_ELEMENTS;
const DEFAULT_COMPONENTS_FOLDER_PATH = 'src/components';

const wsEdit = new vscode.WorkspaceEdit();
const wsPath = vscode.workspace.workspaceFolders![0].uri.fsPath;

// user component path
let userComponentFolderPath: string | undefined;

export async function createReactComponentAction() {
  try {
    const { componentNameInput, htmlElementInput } = await getUserInputs();
    const { componentFilePath, fileIndexPath } =
      getComponentFileUri(componentNameInput);

    wsEdit.createFile(componentFilePath, { ignoreIfExists: true });
    wsEdit.createFile(fileIndexPath, { ignoreIfExists: true });
    await vscode.workspace.applyEdit(wsEdit);

    createIndexFile(fileIndexPath, componentNameInput);
    creatComponentFile(componentFilePath, componentNameInput, htmlElementInput);
  } catch (error) {
    vscode.window.showErrorMessage(error.message);
  }
}

async function getUserInputs() {
  if (!userComponentFolderPath) {
    userComponentFolderPath = await vscode.window.showInputBox({
      title: 'Please Input the component folder path',
      placeHolder: DEFAULT_COMPONENTS_FOLDER_PATH,
    });

    if (!userComponentFolderPath) {
      userComponentFolderPath = DEFAULT_COMPONENTS_FOLDER_PATH;
    }
  }

  const componentNameInput = await vscode.window.showInputBox({
    title: 'Please Input the component name',
    placeHolder: 'UserNameInput',
  });

  const htmlElementInput = await vscode.window.showInputBox({
    title: 'Please Input HTML Element name',
    placeHolder: Object.keys(AVAILABLE_REACT_ELEMENTS).join(', '),
  });

  if (
    !componentNameInput ||
    !htmlElementInput ||
    !htmlTemplates[htmlElementInput]
  ) {
    throw new InputValidationError('Please check the input');
  }

  return {
    componentNameInput,
    htmlElementInput: htmlElementInput as AvailableElement,
  };
}

function validateFiles(
  componentFilePath: vscode.Uri,
  fileIndexPath: vscode.Uri
) {
  if (
    fs.existsSync(componentFilePath.fsPath) ||
    fs.existsSync(fileIndexPath.fsPath)
  ) {
    throw new FileAlreadyExistsError('The Component already exists.');
  }
}

function getComponentFileUri(componentNameInput: string) {
  const componentFilePath = vscode.Uri.file(
    `${wsPath}/${userComponentFolderPath}/${componentNameInput}/${componentNameInput}.tsx`
  );

  const fileIndexPath = vscode.Uri.file(
    `${wsPath}/${userComponentFolderPath}/${componentNameInput}/index.ts`
  );

  validateFiles(componentFilePath, fileIndexPath);

  return {
    componentFilePath,
    fileIndexPath,
  };
}

function createIndexFile(
  fileIndexPath: vscode.Uri,
  componentNameInput: string
) {
  fs.writeFile(
    fileIndexPath.fsPath,
    `export * from './${componentNameInput}'`,
    { encoding: 'utf8' },
    handleWriteFile
  );
}

function creatComponentFile(
  componentFilePath: vscode.Uri,
  componentNameInput: string,
  htmlElementInput: AvailableElement
) {
  const templatePath = path.resolve(
    __dirname,
    `templates/${htmlTemplates[htmlElementInput].replaceName}.tsx`
  );
  const buffer = fs.readFileSync(templatePath, 'UTF-8');

  const changedText = buffer
    .toString()
    .replaceAll(
      htmlTemplates[htmlElementInput].replaceName,
      componentNameInput
    );

  fs.writeFile(
    componentFilePath.fsPath,
    changedText,
    { encoding: 'utf8' },
    handleWriteFile
  );
}

function handleWriteFile(error: NodeJS.ErrnoException) {
  if (error) {
    vscode.window.showErrorMessage(error.message);
  } else {
    vscode.window.showInformationMessage('Generated React Component');
  }
}
