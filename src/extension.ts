import * as vscode from 'vscode';
import { createReactComponentAction, createHtmlComponentAction } from './core';

export function activate(context: vscode.ExtensionContext) {
  // html element
  const disposable = vscode.commands.registerCommand(
    'generate-react-component.generate.html.component',
    createHtmlComponentAction
  );

  // react component (List, CheckboxGroup .etc)
  const disposable2 = vscode.commands.registerCommand(
    'generate-react-component.generate.react.component',
    createReactComponentAction
  );

  // const disposable3 = vscode.commands.registerCommand(
  //   'generate-react-component.generate.react.component.class',
  //   createReactComponentAction
  // );

  context.subscriptions.push(disposable);
  context.subscriptions.push(disposable2);
  // context.subscriptions.push(disposable3);
}

export function deactivate() {}
