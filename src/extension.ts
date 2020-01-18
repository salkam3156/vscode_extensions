import * as vscode from "vscode";

interface Task {
  name: string;
  filePick: boolean;
  requiredFileFilters: string;
  commandString: string;
}

const tasks: Task[] = [
  {
    name: "Run JSON Mock Server",
    filePick: true,
    commandString: `json-server --watch db.json`,
    requiredFileFilters: "json"
  },
  {
    name: "Serve the application",
    filePick: false,
    commandString: "npm run",
    requiredFileFilters: ""
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
        return;
      }

      let chosenTask = tasks.find(task => task.name === choice);

      if (chosenTask?.filePick) {
        vscode.window.showOpenDialog({
          canSelectFiles: true,
          filters: { "": [`${chosenTask.requiredFileFilters}`] }
        });
      }

      vscode.window.showInformationMessage("Nice");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
