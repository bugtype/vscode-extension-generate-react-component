import * as vscode from "vscode";
import * as fs from "fs-extra";
import path from "path";
import { USED_REACT_ELEMENTS } from "./const";

type UsedElement = keyof typeof USED_REACT_ELEMENTS;

const htmlTemplates = USED_REACT_ELEMENTS;

const DEFAULT_COMPONENTS_FOLDER_PATH = "src/components";
let userComponentFolderPath: string | undefined;

export async function createReactComponentAction() {
  const { componentNameInput, htmlElementInput } = await getUserInputs();

  // if Not input
  if (
    !componentNameInput ||
    !htmlElementInput ||
    !htmlTemplates[htmlElementInput]
  ) {
    vscode.window.showErrorMessage("Please check the input");
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
    vscode.window.showErrorMessage("The Component already exists.");
    return;
  }

  wsEdit.createFile(componentFilePath, { ignoreIfExists: true });
  wsEdit.createFile(fileIndexPath, { ignoreIfExists: true });
  await vscode.workspace.applyEdit(wsEdit);

  /**
   * file write / index.ts
   */

  fs.writeFile(
    fileIndexPath.fsPath,
    `export * from './${componentNameInput}'`,
    {
      encoding: "utf8",
    },
    handleWriteFile
  );

  /**
   * file write / component file.tsx
   */

  const templatePath = path.resolve(
    __dirname,
    `templates/html-elements/${htmlTemplates[htmlElementInput].replaceName}.tsx`
  );

  vscode.window.showInformationMessage(templatePath);

  const buffer = fs.readFileSync(templatePath, "UTF-8");

  const changedText = buffer
    .toString()
    .replaceAll(
      htmlTemplates[htmlElementInput].replaceName,
      componentNameInput
    );

  fs.writeFile(
    componentFilePath.fsPath,
    changedText,
    { encoding: "utf8" },
    handleWriteFile
  );
}

async function getUserInputs() {
  if (!userComponentFolderPath) {
    userComponentFolderPath = await vscode.window.showInputBox({
      title: "Please Input the component folder path",
      placeHolder: DEFAULT_COMPONENTS_FOLDER_PATH,
    });

    if (!userComponentFolderPath) {
      userComponentFolderPath = DEFAULT_COMPONENTS_FOLDER_PATH;
    }
  }

  const componentNameInput = await vscode.window.showInputBox({
    title: "Please Input the component name",
    placeHolder: "UserNameInput",
  });

  const htmlElementInput = await vscode.window.showInputBox({
    title: "Please HTML Element name",
    placeHolder: Object.keys(USED_REACT_ELEMENTS).join(", "),
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
    vscode.window.showInformationMessage("Generated React Component");
  }
}
