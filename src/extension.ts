import * as vscode from "vscode";

const childProcess = require("child_process");

interface Task {
  name: string;
  filePick: boolean;
  requiredFileFilters: string;
  //TODO: parametrize in case file is not the last parameter in the command
  commandString: string;
  fileSelectionMsg: string;
}

const tasks: Task[] = [
  {
    name: "Run JSON Mock Server",
    filePick: true,
    commandString: `json-server --watch`,
    requiredFileFilters: "json",
    fileSelectionMsg: "Specify the .json DB file"
  },
  {
    name: "Serve the application",
    filePick: false,
    commandString: "npm run",
    requiredFileFilters: "",
    fileSelectionMsg: ""
  }
];

let runEverything: boolean = false;

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.warun",
    async () => {
      await vscode.window
        .showQuickPick(["Yes", "No"], {
          placeHolder: "Start all modules ?"
        })
        .then(prev => {
          if (prev === "Yes") {
            tasks.forEach(task => executeTask(task));
            return;
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

      executeTask(chosenTask);
      vscode.window.showInformationMessage("Nice");
    }
  );

  context.subscriptions.push(disposable);

  async function executeTask(task: Task | undefined) {
    if (task?.filePick) {
      await vscode.window
        .showOpenDialog({
          canSelectFiles: true,
          openLabel: `${task.fileSelectionMsg}`,
          filters: { "": [`${task.requiredFileFilters}`] }
        })
        .then(file => (task.commandString += " " + file));
    }

    childProcess.exec(
      task?.commandString,
      (err: any, stdout: any, stderr: any) => {
        console.log(err);
        if (stderr) {
          vscode.window.showErrorMessage(stderr);
        }
      }
    );
  }
}

export function deactivate() {}
