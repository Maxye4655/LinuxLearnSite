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
                    content: "Remember to learn Linux!\nDon't forget to practice permissions."
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
                      },
                      "deploy.sh": {
                        type: "file",
                        content: '#!/bin/bash\necho "Deploying project..."',
                        perms: "rw-r--r--"
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
  let commandHistory = [];

  function getPerms(node) {
    return node.perms || (node.type === "dir" ? "rwxr-xr-x" : "rw-r--r--");
  }

  function getOwner(node) {
    return node.owner || "student";
  }

  function getGroup(node) {
    return node.group || "student";
  }

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
      const typeChar = item.type === "dir" ? "d" : "-";
      const perms = getPerms(item);
      const owner = getOwner(item);
      const group = getGroup(item);
      const label = item.type === "dir" ? name + "/" : name;

      return `${typeChar}${perms}  ${owner} ${group}  ${label}`;
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

  function octalToRwx(digit) {
    const n = parseInt(digit, 10);
    return (n & 4 ? "r" : "-") + (n & 2 ? "w" : "-") + (n & 1 ? "x" : "-");
  }

  function chmodCommand(args) {
    if (args.length < 2) {
      return "chmod: missing operand\nUsage: chmod <mode> <file>";
    }

    const mode = args[0];
    const target = resolvePath(args[1]);
    const node = getNode(target);

    if (!node) {
      return `chmod: cannot access '${args[1]}': No such file or directory`;
    }

    if (/^[0-7]{3}$/.test(mode)) {
      node.perms = mode.split("").map(octalToRwx).join("");
      return "";
    }

    const symbolic = mode.match(/^([+-])([rwx]+)$/);

    if (symbolic) {
      const sign = symbolic[1];
      const letters = symbolic[2].split("");
      const current = getPerms(node).split("");

      letters.forEach(letter => {
        const offset = "rwx".indexOf(letter);
        [0, 1, 2].forEach(triplet => {
          current[triplet * 3 + offset] = sign === "+" ? letter : "-";
        });
      });

      node.perms = current.join("");
      return "";
    }

    return `chmod: invalid mode: '${mode}'`;
  }

  function chownCommand(args) {
    if (args.length < 2) {
      return "chown: missing operand\nUsage: chown <owner>[:group] <file>";
    }

    let owner = args[0];
    let group = null;

    if (owner.includes(":")) {
      [owner, group] = owner.split(":");
    }

    const target = resolvePath(args[1]);
    const node = getNode(target);

    if (!node) {
      return `chown: cannot access '${args[1]}': No such file or directory`;
    }

    node.owner = owner;
    if (group) node.group = group;

    return "";
  }

  function grepCommand(args) {
    let ignoreCase = false;
    let rest = args;

    if (rest[0] === "-i") {
      ignoreCase = true;
      rest = rest.slice(1);
    }

    if (rest.length < 2) {
      return "grep: missing operand\nUsage: grep [-i] <pattern> <file>";
    }

    const pattern = ignoreCase ? rest[0].toLowerCase() : rest[0];
    const target = resolvePath(rest[1]);
    const node = getNode(target);

    if (!node) {
      return `grep: ${rest[1]}: No such file or directory`;
    }

    if (node.type === "dir") {
      return `grep: ${rest[1]}: Is a directory`;
    }

    const lines = (node.content || "").split("\n");

    const matches = lines.filter(line => {
      const compare = ignoreCase ? line.toLowerCase() : line;
      return compare.includes(pattern);
    });

    return matches.join("\n");
  }

  function historyCommand() {
    return commandHistory
      .map((cmd, index) => `${String(index + 1).padStart(4)}  ${cmd}`)
      .join("\n");
  }

  const manPages = {
    pwd: "PWD(1)\n\nNAME\n  pwd - print the current working directory\n\nDESCRIPTION\n  Prints the full path of the directory you are currently in.",
    ls: "LS(1)\n\nNAME\n  ls - list directory contents\n\nOPTIONS\n  -a  show hidden files\n  -l  use a long listing format (permissions, owner, group)",
    cd: "CD(1)\n\nNAME\n  cd - change the current directory\n\nSYNOPSIS\n  cd [directory]\n\nDESCRIPTION\n  With no argument, returns to the home directory. Use '..' to move up, '.' for the current directory, and '~' for home.",
    cat: "CAT(1)\n\nNAME\n  cat - print file contents\n\nSYNOPSIS\n  cat <file>",
    find: "FIND(1)\n\nNAME\n  find - search for files in a directory tree\n\nSYNOPSIS\n  find [path] [-name pattern]",
    tree: "TREE(1)\n\nNAME\n  tree - display a directory structure as a tree",
    grep: "GREP(1)\n\nNAME\n  grep - search a file for lines matching a pattern\n\nSYNOPSIS\n  grep [-i] <pattern> <file>\n\nOPTIONS\n  -i  ignore case when matching",
    chmod: "CHMOD(1)\n\nNAME\n  chmod - change file permissions\n\nSYNOPSIS\n  chmod <mode> <file>\n\nDESCRIPTION\n  <mode> can be a 3-digit octal value (e.g. 755) or symbolic (e.g. +x, -w).",
    chown: "CHOWN(1)\n\nNAME\n  chown - change file owner (and group)\n\nSYNOPSIS\n  chown <owner>[:group] <file>",
    ps: "PS(1)\n\nNAME\n  ps - report running processes\n\nSYNOPSIS\n  ps [-e]\n\nOPTIONS\n  -e  show every process on the system, not just your own",
    kill: "KILL(1)\n\nNAME\n  kill - send a signal to a process\n\nSYNOPSIS\n  kill <pid>",
    top: "TOP(1)\n\nNAME\n  top - display a live snapshot of running processes",
    ping: "PING(1)\n\nNAME\n  ping - test connectivity to a host\n\nSYNOPSIS\n  ping <host>",
    ip: "IP(1)\n\nNAME\n  ip - show network interfaces\n\nSYNOPSIS\n  ip addr",
    curl: "CURL(1)\n\nNAME\n  curl - transfer data from a URL\n\nSYNOPSIS\n  curl <url>",
    traceroute: "TRACEROUTE(1)\n\nNAME\n  traceroute - show the network hops to a host\n\nSYNOPSIS\n  traceroute <host>",
    scp: "SCP(1)\n\nNAME\n  scp - copy files securely over SSH\n\nSYNOPSIS\n  scp <source> <destination>",
    history: "HISTORY(1)\n\nNAME\n  history - show previously run commands",
    man: "MAN(1)\n\nNAME\n  man - show the manual page for a command\n\nSYNOPSIS\n  man <command>",
    echo: "ECHO(1)\n\nNAME\n  echo - print text to the terminal",
    whoami: "WHOAMI(1)\n\nNAME\n  whoami - print the current username",
    hostname: "HOSTNAME(1)\n\nNAME\n  hostname - print the machine's hostname",
    clear: "CLEAR(1)\n\nNAME\n  clear - clear the terminal screen",
    help: "HELP(1)\n\nNAME\n  help - list the commands available in this simulator"
  };

  function manCommand(args) {
    if (args.length === 0) {
      return "What manual page do you want?\nUsage: man <command>";
    }

    const page = manPages[args[0]];

    if (!page) {
      return `No manual entry for ${args[0]}`;
    }

    return page;
  }

  const processList = [
    { pid: 1, user: "root", cmd: "systemd" },
    { pid: 118, user: "root", cmd: "sshd" },
    { pid: 256, user: "root", cmd: "cron" },
    { pid: 542, user: "student", cmd: "bash" },
    { pid: 601, user: "student", cmd: "code" },
    { pid: 734, user: "student", cmd: "firefox" }
  ];

  function psCommand(args) {
    const showAll = args.includes("-e") || args.includes("-ef") || args.includes("aux");
    const rows = showAll
      ? processList
      : processList.filter(p => p.user === "student");

    let out = "  PID USER     CMD\n";
    rows.forEach(p => {
      out += `${String(p.pid).padStart(5)} ${p.user.padEnd(8)} ${p.cmd}\n`;
    });

    return out.trimEnd();
  }

  function killCommand(args) {
    if (args.length === 0) {
      return "kill: usage: kill <pid>";
    }

    const pid = parseInt(args[args.length - 1], 10);
    const proc = processList.find(p => p.pid === pid);

    if (!proc) {
      return `bash: kill: (${args[args.length - 1]}) - No such process`;
    }

    return `[${pid}] Terminated (${proc.cmd})`;
  }

  function topCommand() {
    let out = `top - ${processList.length} processes running\n\n`;
    out += "  PID USER     %CPU  %MEM  CMD\n";

    processList.forEach(p => {
      const cpu = (Math.random() * 6).toFixed(1);
      const mem = (Math.random() * 4).toFixed(1);
      out += `${String(p.pid).padStart(5)} ${p.user.padEnd(8)} ${cpu.padStart(4)}  ${mem.padStart(4)}  ${p.cmd}\n`;
    });

    out += "\n(Simulated snapshot. Press Ctrl+C to stop 'top' on a real system.)";
    return out.trimEnd();
  }

  function pingCommand(args) {
    if (args.length === 0) {
      return "ping: usage: ping <host>";
    }

    const host = args[0];
    const lines = [`PING ${host} (10.0.2.15): 56 data bytes`];

    for (let i = 0; i < 4; i++) {
      const time = (Math.random() * 20 + 5).toFixed(1);
      lines.push(`64 bytes from ${host}: icmp_seq=${i} ttl=64 time=${time} ms`);
    }

    lines.push("");
    lines.push(`--- ${host} ping statistics ---`);
    lines.push("4 packets transmitted, 4 received, 0% packet loss");

    return lines.join("\n");
  }

  function ipCommand(args) {
    if (args[0] !== "addr" && args[0] !== "a") {
      return "Usage: ip addr";
    }

    return [
      "1: lo: <LOOPBACK,UP> mtu 65536",
      "    inet 127.0.0.1/8 scope host lo",
      "2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500",
      "    inet 10.0.2.15/24 scope global eth0"
    ].join("\n");
  }

  function curlCommand(args) {
    if (args.length === 0) {
      return "curl: try 'curl <url>'";
    }

    const url = args[0];

    return [
      `*   Trying ${url}...`,
      "< HTTP/1.1 200 OK",
      "< Content-Type: text/html",
      "",
      `<!doctype html><html><body>Hello from ${url}</body></html>`
    ].join("\n");
  }

  function tracerouteCommand(args) {
    if (args.length === 0) {
      return "traceroute: usage: traceroute <host>";
    }

    const host = args[0];
    const lines = [`traceroute to ${host}, 30 hops max`];

    for (let i = 1; i <= 4; i++) {
      const time = (Math.random() * 15 + i * 3).toFixed(1);
      lines.push(`${i}  10.0.${i}.1  ${time} ms`);
    }

    lines.push(`5  ${host}  ${(Math.random() * 10 + 20).toFixed(1)} ms`);

    return lines.join("\n");
  }

  function scpCommand(args) {
    if (args.length < 2) {
      return "scp: usage: scp <source> <destination>";
    }

    return `${args[0]}   100%   1.2KB   1.2MB/s   00:00`;
  }

  function isErrorOutput(output) {
    if (!output) return false;
    return /^(bash:|pwd:|ls:|cd:|cat:|find:|grep:|chmod:|chown:|kill:|ping:|curl:|traceroute:|scp:|man:)/.test(output)
      || output.includes("command not found")
      || output.includes("No such file or directory")
      || output.includes("No such process");
  }

  function runSingle(command) {
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

      case "grep":
        return grepCommand(args);

      case "chmod":
        return chmodCommand(args);

      case "chown":
        return chownCommand(args);

      case "ps":
        return psCommand(args);

      case "kill":
        return killCommand(args);

      case "top":
        return topCommand();

      case "ping":
        return pingCommand(args);

      case "ip":
        return ipCommand(args);

      case "curl":
        return curlCommand(args);

      case "traceroute":
        return tracerouteCommand(args);

      case "scp":
        return scpCommand(args);

      case "history":
        return historyCommand();

      case "man":
        return manCommand(args);

      case "help":
        return [
          "Available commands:",
          "",
          "  pwd         Print the current directory",
          "  ls          List files and directories (-a, -l)",
          "  cd          Change directory",
          "  cat         Display a file",
          "  find        Search for files",
          "  tree        Display the directory structure",
          "  grep        Search a file for a pattern (-i)",
          "  chmod       Change file permissions",
          "  chown       Change file owner/group",
          "  ps          List running processes (-e)",
          "  kill        Send a signal to a process",
          "  top         Show a snapshot of running processes",
          "  ping        Test connectivity to a host",
          "  ip addr     Show network interfaces",
          "  curl        Fetch a URL",
          "  traceroute  Show the network hops to a host",
          "  scp         Copy a file over SSH",
          "  history     Show previously run commands",
          "  man         Show the manual page for a command",
          "  whoami      Display the current user",
          "  hostname    Display the computer's hostname",
          "  echo        Print text",
          "  clear       Clear the terminal",
          "  help        Show this help message",
          "",
          "Commands can be chained with && (e.g. pwd && ls)."
        ].join("\n");

      default:
        return `bash: ${cmd}: command not found`;
    }
  }

  function execute(command) {
    const chainParts = command.split("&&").map(part => part.trim()).filter(Boolean);

    if (chainParts.length === 0) {
      return "";
    }

    if (chainParts.length === 1) {
      return runSingle(chainParts[0]);
    }

    const outputs = [];

    for (const part of chainParts) {
      const result = runSingle(part);
      if (result) outputs.push(result);
      if (isErrorOutput(result)) break;
    }

    return outputs.join("\n");
  }

  terminal.terminal(
    function (command) {
      const trimmed = command.trim();
      if (trimmed) commandHistory.push(trimmed);
      return execute(command);
    },
    {
      greetings: [
        "SudoSchool Linux Terminal",
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
        "grep",
        "chmod",
        "chown",
        "ps",
        "kill",
        "top",
        "ping",
        "ip",
        "curl",
        "traceroute",
        "scp",
        "history",
        "man",
        "whoami",
        "hostname",
        "echo",
        "clear",
        "help"
      ]
    }
  );
});
