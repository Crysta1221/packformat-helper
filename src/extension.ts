import * as vscode from "vscode";
import { registerDecorations } from "./decoration";
import { registerCommand } from "./command";

export function activate(context: vscode.ExtensionContext): void {
  registerDecorations(context);
  registerCommand(context);
}

export function deactivate(): void {}