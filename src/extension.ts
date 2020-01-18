// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

interface Task {
  name: string;
  filePick: boolean;
  value: string;
}

const tasks: Task[] = [
  {
    name: "Run JSON Mock Server",
    filePick: true,
    value: "json-server --watch db.json"
  }
];

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "warun" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "extension.warun",
    async () => {
      // The code you place here will be executed every time your command is executed
      let choice = await vscode.window.showQuickPick(
        tasks.map(task => {
          return task.name;
        }),
        {
          placeHolder: "What would you like to run ?"
        }
      );

      if (!choice) {
        vscode.window.showErrorMessage(
          `Something went wrong picking ${choice}`
        );
        return;
      }

      vscode.window.showInformationMessage("Nice");
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
