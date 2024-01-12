import { exec } from 'child_process';

console.log('Starting backup process...');

// Run the Bash script using exec
const child = exec(`bash ./backup.sh`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`Error: ${stderr}`);
        return;
    }

    console.log('MySQL backup completed!');
});

// You can add an event listener for the 'exit' event if needed
child.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
});
