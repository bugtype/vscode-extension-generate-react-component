import * as vscode from 'vscode';
import * as fs from 'fs-extra';

export async function createReactComponentAction() {
  const input = await vscode.window.showInputBox({
    title: 'Please Input the component name',
    placeHolder: 'UserNameInput',
  });
  vscode.window.showInformationMessage(input || '');

  // create new file
  const wsedit = new vscode.WorkspaceEdit();
  const wsPath = vscode.workspace.workspaceFolders![0].uri.fsPath; // gets the path of the first workspace folder
  const filePath = vscode.Uri.file(
    wsPath + `/components/${input}/${input}.tsx`
  );
  const fileIndexPath = vscode.Uri.file(
    wsPath + `/components/${input}/index.tsx`
  );

  vscode.window.showInformationMessage(filePath.toString());

  wsedit.createFile(filePath, { ignoreIfExists: true });
  wsedit.createFile(fileIndexPath, { ignoreIfExists: true });
  await vscode.workspace.applyEdit(wsedit);

  await fs.writeFile(
    fileIndexPath.fsPath,
    `export * from './${input}'`,
    {
      encoding: 'utf8',
    },
    (err) => {
      if (err) {
        vscode.window.showErrorMessage(err.message);
      } else {
        vscode.window.showInformationMessage('Generated React Component');
      }
    }
  );
}
