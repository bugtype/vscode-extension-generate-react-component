import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as _htmlTemplates from '../templates/html-elements';

type UsedElement = keyof typeof _htmlTemplates;

const htmlTemplates = _htmlTemplates;

const DEFAULT_COMPONENTS_FOLDER_PATH = 'src/components';

let userComponentFolderPath: string | undefined;

export async function createHtmlComponentAction() {
  const { componentNameInput, htmlElementInput } = await getUserInputs();
  // if Not input
  if (
    !componentNameInput ||
    !htmlElementInput ||
    !Object.keys(htmlTemplates).includes(htmlElementInput)
  ) {
    vscode.window.showErrorMessage('Please check the input');
    return;
  }

  /**
   * Create new files
   */

  const wsEdit = new vscode.WorkspaceEdit();
  const wsPath = vscode.workspace.workspaceFolders![0].uri.fsPath;

  // TODO: Add a method of modify the component path
  const componentFilePath = vscode.Uri.file(
    `${wsPath}/${userComponentFolderPath}/${componentNameInput}/${componentNameInput}.tsx`
  );

  const fileIndexPath = vscode.Uri.file(
    `${wsPath}/${userComponentFolderPath}/${componentNameInput}/index.ts`
  );

  if (
    fs.existsSync(componentFilePath.fsPath) ||
    fs.existsSync(fileIndexPath.fsPath)
  ) {
    vscode.window.showErrorMessage('The Component already exists.');
    return;
  }

  wsEdit.createFile(componentFilePath, { ignoreIfExists: true });
  wsEdit.createFile(fileIndexPath, { ignoreIfExists: true });
  await vscode.workspace.applyEdit(wsEdit);

  /**
   * file write
   */

  fs.writeFile(
    fileIndexPath.fsPath,
    `export * from './${componentNameInput}'`,
    {
      encoding: 'utf8',
    },
    handleWriteFile
  );

  const changedText = htmlTemplates[htmlElementInput].replaceAll(
    /ComponentName/gi,
    componentNameInput
  );

  fs.writeFile(
    componentFilePath.fsPath,
    changedText,
    {
      encoding: 'utf8',
    },
    handleWriteFile
  );
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
    title: 'Please HTML Element name',
    placeHolder: 'div, img',
  });

  return {
    componentNameInput,
    htmlElementInput: htmlElementInput as UsedElement | undefined,
  };
}

function handleWriteFile(error: NodeJS.ErrnoException) {
  if (error) {
    vscode.window.showErrorMessage(error.message);
  } else {
    vscode.window.showInformationMessage('Generated React Component');
  }
}
