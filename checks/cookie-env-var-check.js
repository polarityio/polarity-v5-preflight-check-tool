const name = 'POLARITY_COOKIE_SAMESITE Check';

function check(env, config, polarity, pgClient, polarityPath, logger) {
  if (env.hasOwnProperty('POLARITY_COOKIE_SAMESITE')) {
    return `  POLARITY_COOKIE_SAMESITE: ${env.POLARITY_COOKIE_SAMESITE}`;
  } else {
    return '  POLARITY_COOKIE_SAMESITE is not set';
  }
}

module.exports = {
  check,
  name
};
