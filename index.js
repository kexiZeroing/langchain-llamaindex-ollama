import { select } from '@inquirer/prompts';
import { spawn } from 'node:child_process';

const answer = await select({
  message: 'Run a program',
  choices: [
    {
      name: 'chat',
      value: 'chat',
    },
    {
      name: 'rag',
      value: 'rag',
    }
  ],
});

// Share the standard input, output, and error streams between the parent and the child processes.
const child = spawn('node', [`src/${answer}.js`], { stdio: 'inherit' });

child.on('close', (code) => {
  console.log(`Child process exited with code ${code}`);
});

child.on('error', (err) => {
  console.error('Failed to start subprocess.', err);
});
