import * as vscode from "vscode";

const childProcess = require("child_process");

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
    //TODO: parametrize in case file is not the last parameter in the command
    commandString: `json-server --watch`,
    requiredFileFilters: "json"
  },
  {
    name: "Serve the application",
    filePick: false,
    commandString: "npm run",
    requiredFileFilters: ""
  }
];

let runEverything: boolean = false;

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.warun",
    async () => {
      let runAll = await vscode.window
        .showQuickPick(["Yes", "No"], {
          placeHolder: "Start all modules ?"
        })
        .then(prev => {
          if (prev === "Yes") {
            vscode.window.showInformationMessage("yo whaddup ? ");
          }
        });

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
        let file = vscode.window.showOpenDialog({
          canSelectFiles: true,
          filters: { "": [`${chosenTask.requiredFileFilters}`] }
        });

        chosenTask.commandString += " " + file;
      }

      childProcess.exec(
        chosenTask?.commandString,
        (err: any, stdout: any, stderr: any) => {
          console.log(err);
        }
      );
      vscode.window.showInformationMessage("Nice");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
