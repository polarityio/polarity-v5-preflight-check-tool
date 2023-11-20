const os = require('os');
const byteSize = require('byte-size');

const name = 'Operating System Check';

function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  report.push(`  OS Type: ${os.type()}`);
  report.push(`  OS Platform: ${os.platform()}`);
  report.push(`  OS Release: ${os.release()}`);
  report.push(`  OS Architecture: ${os.arch()}`);
  report.push(`  OS Num CPUs: ${os.cpus().length}`);
  report.push(`  OS Memory: ${byteSize(os.totalmem())}`);

  return report.join('\n');
}

module.exports = {
  check,
  name
};
