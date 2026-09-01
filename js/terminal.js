$(function () {
  const terminal = $("#terminal");
  const filesystem = {
    type: "dir",
    children: {
      home: {
        type: "dir",
        children: {
          student: {
            type: "dir",
            children: {
              Documents: {
                type: "dir",
                children: {
                  "notes.txt": {
                    type: "file",
                    content: "Remember to learn Linux!"
                  },
                  "project.txt": {
                    type: "file",
                    content: "My first Linux project."
                  },
                  projects: {
                    type: "dir",
                    children: {
                      "hello.py": {
                        type: "file",
                        content: 'print("Hello, Linux!")'
                      },
                      "README.md": {
                        type: "file",
                        content: "# My Project"
                      }
                    }
                  }
                }
              },

              Downloads: {
                type: "dir",
                children: {
                  "linux-guide.pdf": {
                    type: "file",
                    content: ""
                  },
                  "wallpaper.png": {
                    type: "file",
                    content: ""
                  }
                }
              },

              Pictures: {
                type: "dir",
                children: {
                  "penguin.png": {
                    type: "file",
                    content: ""
                  },
                  "terminal.jpg": {
                    type: "file",
                    content: ""
                  }
                }
              },

              Music: {
                type: "dir",
                children: {
                  "favourite-song.mp3": {
                    type: "file",
                    content: ""
                  }
                }
              },

              Desktop: {
                type: "dir",
                children: {
                  "welcome.txt": {
                    type: "file",
                    content: "Welcome to Linux!"
                  }
                }
              },

              ".bashrc": {
                type: "file",
                hidden: true,
                content: "# ~/.bashrc"
              },

              ".config": {
                type: "dir",
                hidden: true,
                children: {
                  terminal: {
                    type: "dir",
                    children: {
                      "config.conf": {
                        type: "file",
                        content: "theme=dark"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },

      etc: {
        type: "dir",
        children: {
          "hostname": {
            type: "file",
            content: "linux-machine"
          },
          "hosts": {
            type: "file",
            content: "127.0.0.1 localhost"
          },
          "os-release": {
            type: "file",
            content: "NAME=\"SudoSchool Linux\""
          },
          ssh: {
            type: "dir",
            children: {
              "sshd_config": {
                type: "file",
                content: "# SSH configuration"
              }
            }
          }
        }
      },

      var: {
        type: "dir",
        children: {
          log: {
            type: "dir",
            children: {
              "system.log": {
                type: "file",
                content: "System started successfully."
              },
              "auth.log": {
                type: "file",
                content: "Authentication events."
              }
            }
          },
          tmp: {
            type: "dir",
            children: {}
          }
        }
      },

      tmp: {
        type: "dir",
        children: {}
      },

      usr: {
        type: "dir",
        children: {
          bin: {
            type: "dir",
            children: {
              bash: { type: "file", content: "" },
              cat: { type: "file", content: "" },
              cd: { type: "file", content: "" },
              ls: { type: "file", content: "" },
              pwd: { type: "file", content: "" },
              find: { type: "file", content: "" }
            }
          },

          share: {
            type: "dir",
            children: {
              doc: {
                type: "dir",
                children: {
                  "README.txt": {
                    type: "file",
                    content: "Documentation lives here."
                  }
                }
              }
            }
          }
        }
      },

      bin: {
        type: "dir",
        children: {
          sh: { type: "file", content: "" },
          bash: { type: "file", content: "" },
          ls: { type: "file", content: "" },
          cp: { type: "file", content: "" },
          mv: { type: "file", content: "" },
          rm: { type: "file", content: "" }
        }
      },

      root: {
        type: "dir",
        children: {
          "README.txt": {
            type: "file",
            content: "This is the root user's home directory."
          }
        }
      }
    }
  };

  let currentPath = [ "home", "student" ];

  function getNode(path) {
    let node = filesystem;

    for (const part of path) {
      if (!node.children || !node.children[part]) {
        return null;
      }

      node = node.children[part];
    }

    return node;
  }

  function pathToString(path) {
    return "/" + path.join("/");
  }

  function normalizePath(path) {
    const result = [];

    for (const part of path) {
      if (!part || part === ".") {
        continue;
      }

      if (part === "..") {
        result.pop();
      } else {
        result.push(part);
      }
    }

    return result;
  }

  function resolvePath(input) {
    if (!input || input === "~") {
      return ["home", "student"];
    }

    if (input.startsWith("~")) {
      input = "/home/student" + input.slice(1);
    }

    let path;

    if (input.startsWith("/")) {
      path = input.split("/");
    } else {
      path = [...currentPath, ...input.split("/")];
    }

    return normalizePath(path);
  }

  function getDisplayPath() {
    const home = ["home", "student"];

    if (
      currentPath.length >= home.length &&
      currentPath[0] === "home" &&
      currentPath[1] === "student"
    ) {
      const remainder = currentPath.slice(2);

      if (remainder.length === 0) {
        return "~";
      }

      return "~/" + remainder.join("/");
    }

    return pathToString(currentPath);
  }

  function listDirectory(args) {
    const node = getNode(currentPath);

    if (!node || node.type !== "dir") {
      return "ls: cannot access directory";
    }

    let showHidden = false;
    let longFormat = false;

    args.forEach(arg => {
      if (arg.includes("a")) showHidden = true;
      if (arg.includes("l")) longFormat = true;
    });

    let entries = Object.entries(node.children);

    if (!showHidden) {
      entries = entries.filter(([name, item]) => !name.startsWith("."));
    }

    if (entries.length === 0) {
      return "";
    }

    if (!longFormat) {
      return entries.map(([name, item]) => {
        return item.type === "dir" ? name + "/" : name;
      }).join("  ");
    }

    return entries.map(([name, item]) => {
      if (item.type === "dir") {
        return `drwxr-xr-x  student student  ${name}/`;
      }

      return `-rw-r--r--  student student  ${name}`;
    }).join("\n");
  }

  function changeDirectory(args) {
    if (args.length === 0) {
      currentPath = ["home", "student"];
      return "";
    }

    const target = resolvePath(args[0]);
    const node = getNode(target);

    if (!node) {
      return `bash: cd: ${args[0]}: No such file or directory`;
    }

    if (node.type !== "dir") {
      return `bash: cd: ${args[0]}: Not a directory`;
    }

    currentPath = target;
    return "";
  }

  function findFiles(args) {
    let startPath = currentPath;
    let namePattern = null;

    if (args.length === 0) {
      return walkFilesystem(startPath, "");
    }

    if (args[0].startsWith("-")) {
      namePattern = args[1];
    } else {
      startPath = resolvePath(args[0]);

      if (args[1] === "-name") {
        namePattern = args[2];
      }
    }

    if (!getNode(startPath)) {
      return `find: '${args[0]}': No such file or directory`;
    }

    return walkFilesystem(startPath, namePattern);
  }

  function walkFilesystem(startPath, pattern) {
    const results = [];

    function walk(path, node) {
      const relativePath = "." + pathToString(path.slice(startPath.length));

      if (path.length > startPath.length) {
        const name = path[path.length - 1];

        if (!pattern || matchesPattern(name, pattern)) {
          results.push(relativePath);
        }
      }

      if (node.type === "dir") {
        for (const [name, child] of Object.entries(node.children)) {
          walk([...path, name], child);
        }
      }
    }

    walk(startPath, getNode(startPath));

    return results.join("\n");
  }

  function matchesPattern(name, pattern) {
    if (!pattern) return true;

    if (pattern === "*") return true;

    if (pattern.startsWith("*.")) {
      return name.endsWith(pattern.slice(1));
    }

    return name === pattern;
  }

  function catFile(args) {
    if (args.length === 0) {
      return "cat: missing operand";
    }

    const target = resolvePath(args[0]);
    const node = getNode(target);

    if (!node) {
      return `cat: ${args[0]}: No such file or directory`;
    }

    if (node.type === "dir") {
      return `cat: ${args[0]}: Is a directory`;
    }

    return node.content || "";
  }

  function treeCommand() {
    const node = getNode(currentPath);

    function render(node, prefix) {
      let output = "";

      const entries = Object.entries(node.children)
        .filter(([name]) => !name.startsWith("."));

      entries.forEach(([name, child], index) => {
        const last = index === entries.length - 1;
        const branch = last ? "└── " : "├── ";

        output += prefix + branch + name;

        if (child.type === "dir") {
          output += "/\n";
          output += render(
            child,
            prefix + (last ? "    " : "│   ")
          );
        } else {
          output += "\n";
        }
      });

      return output;
    }

    return ".\n" + render(node, "");
  }

  function execute(command) {
    const parts = command.trim().split(/\s+/);

    if (parts.length === 0 || !parts[0]) {
      return "";
    }

    const cmd = parts[0];
    const args = parts.slice(1);

    switch (cmd) {
      case "pwd":
        return pathToString(currentPath);

      case "ls":
        return listDirectory(args);

      case "cd":
        return changeDirectory(args);

      case "cat":
        return catFile(args);

      case "find":
        return findFiles(args);

      case "tree":
        return treeCommand();

      case "clear":
        terminal.terminal().clear();
        return "";

      case "whoami":
        return "student";

      case "hostname":
        return "linux-machine";

      case "echo":
        return args.join(" ");

      case "help":
        return [
          "Available commands:",
          "",
          "  pwd       Print the current directory",
          "  ls        List files and directories",
          "  cd        Change directory",
          "  cat       Display a file",
          "  find      Search for files",
          "  tree      Display the directory structure",
          "  whoami    Display the current user",
          "  hostname  Display the computer's hostname",
          "  echo      Print text",
          "  clear     Clear the terminal",
          "  help      Show this help message"
        ].join("\n");

      default:
        return `bash: ${cmd}: command not found`;
    }
  }

  terminal.terminal(
    function (command) {
      return execute(command);
    },
    {
      greetings: [
        "SudoSchool Linux [Lesson 2]",
        "Type 'help' to see available commands.",
        ""
      ].join("\n"),

      prompt: function () {
        return `student@linux-machine:${getDisplayPath()}$ `;
      },

      completion: [
        "pwd",
        "ls",
        "cd",
        "cat",
        "find",
        "tree",
        "whoami",
        "hostname",
        "echo",
        "clear",
        "help"
      ]
    }
  );
});
