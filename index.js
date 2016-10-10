require('shelljs/global');
const fs = require('fs');

const argv = require('yargs')
  .usage('imonit -n <task_name> -e <command_to_exec>')
  .example('imonit -n compile_stuff -e "grunt build"', 'Runs grunt build but only once')
  .demand(['n', 'e'])
  .string(['n', 'e'])
  .describe('n', 'name of the task')
  .alias('n', 'name')
  .describe('e', 'command to execute')
  .alias('e', 'exec')
  .help('h')
  .alias('h', 'help')
  .argv;

// Ensure grunt exists
config.silent = true;

const name = argv.name.replace(/\s/g, '_');
const dateToMinute = (new Date()).toISOString().replace(/:\d\d.\d\d\dZ$/, '').replace(':', '-');

const prefix = name + '-' + dateToMinute + '-';
const rnd = String(Math.random()).substr(2, 8);
const existingFiles = ls(`/tmp/${prefix}*`);

if (existingFiles.length) process.exit(0);

const filename = `/tmp/${prefix}${rnd}`;
fs.writeFileSync(filename, rnd, { encoding: 'utf8' });

// Do the build
config.silent = false;
const r = exec(argv.exec);

// Remove the semaphore file
rm(filename);

// Fwd error code
process.exit(r.code);
