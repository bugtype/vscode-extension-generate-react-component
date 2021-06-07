import * as vscode from 'vscode';
import { createReactComponentAction } from './core';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'generate-react-component.generate.react.component',
    createReactComponentAction
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
