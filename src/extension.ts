import * as vscode from 'vscode';
import { createReactComponentAction } from './core';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'generate-react-component.generate.react.component',
    createReactComponentAction
  );

  // TODO: todo
  // const disposable2 = vscode.commands.registerCommand(
  //   'generate-react-component.generate.react.component.design',
  //   createReactComponentAction
  // );

  // const disposable3 = vscode.commands.registerCommand(
  //   'generate-react-component.generate.react.component.class',
  //   createReactComponentAction
  // );

  context.subscriptions.push(disposable);
  // context.subscriptions.push(disposable2);
  // context.subscriptions.push(disposable3);
}

export function deactivate() {}
