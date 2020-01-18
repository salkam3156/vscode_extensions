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

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.warun",
    async () => {
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

export function deactivate() {}
