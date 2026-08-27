$('#terminal').terminal(function(command) {
    if (command === 'help') {
        this.echo('Available commands:');
        this.echo('  help');
        this.echo('  pwd');
        this.echo('  ls');
        this.echo('  whoami');
    }

    else if (command === 'pwd') {
        this.echo('/home/student');
    }

    else if (command === 'ls') {
        this.echo('Documents  Downloads  notes.txt');
    }

    else if (command === 'whoami') {
        this.echo('student');
    }

    else if (command.trim() !== '') {
        this.echo(`bash: ${command}: command not found`);
    }
}, {
    greetings: 'Type "help" to get started.',
    prompt: 'student@sudo-school:~$ ',
    height: '100%'
});