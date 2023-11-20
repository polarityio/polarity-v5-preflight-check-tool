const name = 'Config.js TLS Options Check';

function check(env, config, polarity, pgClient, polarityPath, logger) {
  let report = [];
  let auth = config.authentication;

  if (auth) {
    let jsonStrings = JSON.stringify(auth, null, 2);
    let tokens = jsonStrings.split('\n');
    tokens.forEach((token, index) => {
      report.push(`  ${token}`);
    });
  } else {
    report.push(`  No top level Authentication property in config.js`);
  }

  return report.join('\n');
}

module.exports = {
  check,
  name
};
