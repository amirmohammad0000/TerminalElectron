"use strict";
document.addEventListener("DOMContentLoaded", () => {
  // Start Const
  const PowerShell = require("node-powershell");
  // End Const

  // Start Variables
  let Terminal = document.querySelector(".section_terminal");
  let SelectCommand = document.querySelector(".sect_select_command");
  let RunCodeSelected = document.querySelector(".run_code_selected");
  let ClickClose = document.querySelector(".click_close");
  let DirectoryTerminal = "";
  // End Variables

  // Start Section Terminal
  const FuncCreatePowerShell = () => {
    try {
      const ps = new PowerShell({
        executionPolicy: "Bypass",
        noProfile: false,
        verbose: true,
        pwsh: false,
      });

      const FuncGetDirectory = () => {
        ps.addCommand("dir").then();
        ps.invoke().then((output) => {
          DirectoryTerminal = output
            .split("Directory: ")[1]
            .split("Mode")[0]
            .trim();
          Terminal.value = `PS ${DirectoryTerminal}> `;
        });
      };

      const FuncTerminal = () => {
        Terminal.addEventListener("keyup", (e) => {
          let LengthValueTerminal = Terminal.value.split(">").length - 1;
          let ValueTerminal = Terminal.value
            .split(">")
            [LengthValueTerminal].trim();
          if (e.keyCode === 13) {
            ps.addCommand(ValueTerminal, {}).then();
            ps.invoke()
              .then((output) => {
                Terminal.value += `${output}PS ${DirectoryTerminal}> `;
                Terminal.focus();
                if (ValueTerminal.search("cd") === 0) {
                  FuncGetDirectory();
                } else if (
                  ValueTerminal === "clear" ||
                  ValueTerminal === "cls"
                ) {
                  FuncGetDirectory();
                }
              })
              .catch((err) => {
                Terminal.value += `${err}PS ${DirectoryTerminal}> `;
              });
          }
        });
      };

      ClickClose.addEventListener("click", () => {
        Terminal.value = "";
        ps.dispose().then().catch();
        Terminal.focus();
        FuncCreatePowerShell();
      });

      RunCodeSelected.addEventListener("click", () => {
        ps.addCommand(`${SelectCommand.value}`).then();
        ps.invoke()
          .then((output) => {
            Terminal.value += `

${output}PS ${DirectoryTerminal}> `;
            Terminal.focus();
          })
          .catch((err) => {
            Terminal.value += `

${err}PS ${DirectoryTerminal}> `;
          });
      });
      FuncGetDirectory();
      FuncTerminal();
    } catch (err) {
      console.log(err);
    }
  };

  FuncCreatePowerShell();
  // End Section Terminal
});
