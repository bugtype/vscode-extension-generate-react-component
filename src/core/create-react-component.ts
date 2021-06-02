import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as htmlTemplates from '../templates/html-elements/div';

export async function createReactComponentAction() {
  const input = await vscode.window.showInputBox({
    title: 'Please Input the component name',
    placeHolder: 'UserNameInput',
  });

  const elInput = await vscode.window.showInputBox({
    title: 'Please HTML Element name',
    placeHolder: 'div, img',
  });

  // if Not input
  if (!input || !elInput || !Object.keys(htmlTemplates).includes(elInput)) {
    vscode.window.showErrorMessage('Please check the input');
    return;
  }

  // create new file
  const wsEdit = new vscode.WorkspaceEdit();
  const wsPath = vscode.workspace.workspaceFolders![0].uri.fsPath;
  // TODO: Add a method of modify the component path
  const componentFilePath = vscode.Uri.file(
    wsPath + `/components/${input}/${input}.tsx`
  );
  const fileIndexPath = vscode.Uri.file(
    wsPath + `/components/${input}/index.ts`
  );

  wsEdit.createFile(componentFilePath, { ignoreIfExists: true });
  wsEdit.createFile(fileIndexPath, { ignoreIfExists: true });
  await vscode.workspace.applyEdit(wsEdit);

  // if (fs.existsSync(fileIndexPath.fsPath)) {
  //   vscode.window.showErrorMessage('The Component already exists.');
  //   return;
  // }

  await fs.writeFile(
    fileIndexPath.fsPath,
    `export * from './${input}'`,
    {
      encoding: 'utf8',
    },
    handleWriteFileError
  );

  const changedText = htmlTemplates.div.replaceAll(/ComponentName/gi, input);

  await fs.writeFile(
    componentFilePath.fsPath,
    changedText,
    {
      encoding: 'utf8',
    },
    handleWriteFileError
  );
}

function handleWriteFileError(error: NodeJS.ErrnoException) {
  if (error) {
    vscode.window.showErrorMessage(error.message);
  } else {
    vscode.window.showInformationMessage('Generated React Component');
  }
}
