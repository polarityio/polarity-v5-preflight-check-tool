const Polarity = require('polarity-node-rest-api');
const winston = require('winston');
const { Client } = require('pg');
const fs = require('fs');
const { promisify } = require('util');
const Logger = require('./logger');
const readline = require('readline');

const readDirectory = promisify(fs.readdir).bind(this);
const FgGreen = '\x1b[32m';
const FgDefault = '\x1b[39m';
const FgRed = '\x1b[31m';
let pgClient;
let environmentVariables = {};

function parseErrorToReadableJSON(error) {
  return JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
}

async function getCommandLineInfo(prompt, hideInput = false) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(prompt, function (info) {
      rl.close();
      resolve(info);
    });

    if (hideInput) {
      rl._writeToOutput = function _writeToOutput(stringToWrite) {
        rl.output.write('*');
      };
    }
  });
}

const getDatabaseConnectionInfo = (configPath, envPath) => {
  Logger.info(`Loading database configuration from env file ${envPath}`);

  const {
    POLARITY_DB_USER: user,
    POLARITY_DB_HOST: host,
    POLARITY_DB_DATABASE: database,
    POLARITY_DB_PASSWORD: password,
    POLARITY_DB_PORT: port
  } = environmentVariables;

  if (
    typeof user !== 'undefined' &&
    typeof host !== 'undefined' &&
    typeof database !== 'undefined' &&
    typeof password !== 'undefined' &&
    typeof port !== 'undefined'
  ) {
    return { user, host, database, password, port };
  } else {
    Logger.info('Could not find db config vars in .env file. Loading database configuration from config.js file');

    let config;
    try {
      config = require(configPath);
      const { user, host, database, password, port } = config.polarity.postgres;
      return { user, host, database, password, port };
    } catch (e) {
      Logger.error(
        `Could not load specified config file.  Check the path to the config file and permissions. ${configPath}`
      );

      process.exit(1);
    }
  }
};

const checkCmd = {
  command: 'check',
  desc: 'Generate a v5 preflight upgrade report',
  builder: (yargs) => {
    return yargs
      .option('url', {
        type: 'string',
        default: 'https://localhost',
        nargs: 1,
        describe: 'Polarity server url to include schema'
      })
      .option('config', {
        type: 'string',
        nargs: 1,
        default: '/app/polarity-server/config/config.js',
        describe: "Path to the Polarity Server's config file."
      })
      .option('env', {
        type: 'string',
        nargs: 1,
        default: '/app/polarity-server/.env',
        describe: "Path to the Polarity Server's .env file."
      })
      .option('polarityPath', {
        type: 'string',
        nargs: 1,
        default: '/app/polarity-server',
        describe: 'Path to the Polarity Server Directory'
      })
      .option('rejectUnauthorized', {
        type: 'boolean',
        default: true,
        describe: 'If provided, the loader will reject unauthorized SSL connections'
      })
      .option('proxy', {
        type: 'string',
        default: '',
        nargs: 1,
        describe: 'If provided, the connection to the Polarity server will use the provided proxy setting'
      })
      .option('logging', {
        type: 'string',
        default: 'simple',
        choices: ['simple', 'error', 'warn', 'info', 'debug', 'trace'],
        nargs: 1,
        describe: 'The logging level for the script.'
      });
  },
  handler: async (argv) => {
    const {
      url,
      // username: cliUsername,
      // password: cliPassword,
      rejectUnauthorized,
      proxy,
      logging,
      config: configPath,
      env,
      polarityPath
    } = argv;

    Logger.init(logging);

    require('dotenv').config({ path: env, processEnv: environmentVariables });

    Logger.simple(
      'The pre-flight script connects to your Polarity Server via the REST API to gather pre-upgrade information.'
    );
    Logger.simple('You will need to provide the script with the username and password of a local Polarity admin user.');

    const username = await getCommandLineInfo('Enter a local Polarity admin username: ');
    const password = await getCommandLineInfo('Password: ', true);

    Logger.simple('');

    if (!username || !password) {
      Logger.error('You must provide a username and password');
      return;
    }

    Logger.simple('Starting v5 pre-flight check');

    Logger.info('Starting v5 Pre-flight check', {
      url,
      username,
      password: '*******',
      rejectUnauthorized,
      proxy,
      logging,
      configPath,
      env,
      polarityPath
    });

    const polarity = new Polarity(Logger);

    try {
      const pgConnInfo = getDatabaseConnectionInfo(configPath, env);
      const config = require(configPath);
      Logger.info('Postgres Connection Info', { pgConnInfo });

      const connectOptions = {
        host: url,
        username: username,
        password: password
      };

      if (typeof rejectUnauthorized !== 'undefined' || typeof proxy !== 'undefined') {
        connectOptions.request = {};
      }

      if (typeof rejectUnauthorized !== 'undefined') {
        connectOptions.request.rejectUnauthorized = rejectUnauthorized;
      }

      if (typeof proxy !== 'undefined' && proxy && proxy.length > 0) {
        connectOptions.request.proxy = proxy;
      }

      Logger.info('Polarity Connection Options', { ...connectOptions, password: '*******' });

      await polarity.connect(connectOptions);

      Logger.info('Connected to Polarity REST API');

      pgClient = new Client(pgConnInfo);

      await pgClient.connect();
      Logger.info('Connected to Postgres Database');

      Logger.info({ env: environmentVariables }, 'Environment Variables');

      const reporter = fs.createWriteStream('polarity-upgrade-report.txt');

      const checksFileNames = await readDirectory('./checks');
      for (const checkFileName of checksFileNames) {
        const { check, name } = require(`./checks/${checkFileName}`);
        Logger.simpleLine(`Running check - ${name} ... `);
        reporter.write(`### ${name} ###\n\n`);
        try {
          const report = await check(environmentVariables, config, polarity, pgClient, polarityPath, Logger);
          Logger.simple(FgGreen, 'complete', FgDefault);
          reporter.write(report + '\n\n\n');
        } catch (checkError) {
          Logger.simple(FgRed, 'error', FgDefault);
          Logger.simple(FgRed, parseErrorToReadableJSON(checkError), FgDefault);
          reporter.write(parseErrorToReadableJSON(checkError) + '\n\n\n');
        }
      }
      reporter.end();
    } catch (e) {
      Logger.error('Error running preflight check tool. ', e);
    } finally {
      if (polarity && polarity.isConnected) {
        Logger.info('Disconnecting from Polarity');
        await polarity.disconnect();
      }

      if (pgClient) {
        Logger.info('Disconnecting from Postgres database');
        await pgClient.end();
      }

      Logger.simple('Pre-flight check complete.  Report generated in polarity-upgrade-report.txt');
    }
  }
};

require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command(checkCmd)
  .help()
  .wrap(null)
  .version('Polarity v5 Preflight Check Tool v' + require('./package.json').version)
  // help
  .epilog('(C) 2023 Polarity.io, Inc.').argv;
