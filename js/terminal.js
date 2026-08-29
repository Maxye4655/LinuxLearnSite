$(function () {
  const HOME = ['home', 'student'];
  const USER = 'student';
  const HOST = 'sudo-school';

  const fs = {
    type: 'dir',
    contents: {
      home: {
        type: 'dir',
        contents: {
          student: {
            type: 'dir',
            contents: {
              Documents: { type: 'dir', contents: {} },
              Downloads: { type: 'dir', contents: {} },
                'notes.txt': {
                    type: 'file',
                    size: 148,
                    content: `SudoSchool`
                },
              projects: {
                type: 'dir',
                contents: {
                  'hello.c': { type: 'file', size: 84, content: '#include <stdio.h>\nint main(void) { return 0; }' },
                },
              },
            },
          },
          root: {
            type: 'dir',
            contents: {
              'flag.txt': { type: 'file', size: 42, content: 'You found the secret! Nice work.' },
            },
          },
        },
      },
    },
  };

  let cwd = [...HOME];

  function getNode(pathArr) {
    let node = fs;
    for (const p of pathArr) {
      if (p === '') continue;
      if (node.type !== 'dir' || !node.contents[p]) return null;
      node = node.contents[p];
    }
    return node;
  }

  function getDir(pathArr) {
    const node = getNode(pathArr);
    return node && node.type === 'dir' ? node.contents : null;
  }

  function normalize(parts) {
    const out = [];
    for (const p of parts) {
      if (p === '' || p === '.') continue;
      if (p === '..') out.pop();
      else out.push(p);
    }
    return out;
  }

  function resolve(target) {
    if (target === undefined) return normalize(cwd);
    if (target === '~') return [...HOME];
    if (target === '~/' + HOME[1] || target === '~/') return [...HOME];
    if (target.startsWith('~')) {
      const sub = target.slice(2).split('/').filter(Boolean);
      return normalize([...HOME, ...sub]);
    }
    if (target.startsWith('/')) {
      return normalize(target.split('/'));
    }
    return normalize([...cwd, ...target.split('/')]);
  }

  function prompt() {
    const rel = cwd.join('/') === HOME.join('/') ? '~' : '/' + cwd.join('/');
    return `student@sudo-school:${rel}$ `;
  }

  const commands = {
    help: {
      description: 'Show this help message',
      run: function (term) {
        term.echo('Available commands:');
        term.echo('');
        Object.keys(commands).forEach((name) => {
          term.echo(`  ${name.padEnd(10)} ${commands[name].description || ''}`);
        });
      },
    },
    pwd: {
      description: 'Print working directory',
      run: function (term) {
        term.echo('/' + cwd.join('/'));
      },
    },
    whoami: {
      description: 'Print current user',
      run: function (term) {
        term.echo(USER);
      },
    },
    ls: {
      description: 'List directory contents',
      run: function (term, args) {
        const flags = args.filter((a) => a.startsWith('-'));
        const targets = args.filter((a) => !a.startsWith('-'));
        const list = targets.length ? targets : [undefined];
        const long = flags.some((f) => f.includes('l'));
        const all = flags.some((f) => f.includes('a'));

        list.forEach((target, i) => {
          const path = resolve(target);
          const contents = getDir(path);
          const label = target === undefined ? '.' : '/' + path.join('/');
          if (contents === null) {
            term.echo(`ls: cannot access '${label}': No such file or directory`);
            return;
          }
          if (list.length > 1) term.echo(`${label}:`);
          let names = Object.entries(contents);
          if (all) {
            names = names.concat([
              ['.', { type: 'dir' }],
              ['..', { type: 'dir' }],
            ]);
          }
          names.sort((a, b) => a[0].localeCompare(b[0]));
          if (long) {
            term.echo(`total ${names.length}`);
            names.forEach(([name, node]) => {
              const isDir = node.type === 'dir';
              const perms = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
              const size = isDir ? '4096' : String(node.size).padStart(4, ' ');
              term.echo(`${perms} 1 student student ${size} Jan  1 12:00 ${name}${isDir ? '/' : ''}`);
            });
          } else {
            term.echo(names.map(([name, node]) => (node.type === 'dir' ? name + '/' : name)).join('  '));
          }
          if (i < list.length - 1) term.echo('');
        });
      },
    },
    cd: {
      description: 'Change directory',
      run: function (term, args) {
        const target = args[0];
        if (target === undefined) {
          cwd = [...HOME];
        } else {
          const path = resolve(target);
          if (getDir(path) === null) {
            term.echo(`bash: cd: ${target}: No such file or directory`);
            return;
          }
          cwd = path;
        }
        term.set_prompt(prompt());
      },
    },
    cat: {
      description: 'Print file contents',
      run: function (term, args) {
        if (!args.length) {
          term.echo('cat: missing operand');
          term.echo("Try 'cat --help' for more information.");
          return;
        }
        args.forEach((target) => {
          const path = resolve(target);
          const node = getNode(path);
          if (!node) {
            term.echo(`cat: ${target}: No such file or directory`);
          } else if (node.type === 'dir') {
            term.echo(`cat: ${target}: Is a directory`);
          } else {
            term.echo(node.content || `# (empty file, ${node.size} bytes)`);
          }
        });
      },
    },
    echo: {
      description: 'Print text',
      run: function (term, args) {
        term.echo(args.join(' '));
      },
    },
    date: {
      description: 'Print current date and time',
      run: function (term) {
        term.echo(new Date().toString());
      },
    },
    clear: {
      description: 'Clear the terminal',
      run: function (term) {
        term.clear();
      },
    },
  };

  $('#terminal').terminal(
    function (command, term) {
      const trimmed = command.trim();
      if (!trimmed) return;

      const parts = trimmed.split(/\s+/);
      const name = parts[0];
      const handler = commands[name];

      if (handler) {
        handler.run(term, parts.slice(1));
      } else {
        term.echo(`bash: ${name}: command not found`);
        term.echo(`Try 'help' to see available commands.`);
      }
    },
    {
      greetings: 'Welcome to SudoSchool!\nType "help" to see available commands.\n',
      prompt: prompt(),
      height: '100%',
      history: true,
      keymap: undefined,
    }
  );
});
