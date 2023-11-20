const name = 'NODE Extra CA Certs Check';

function check(env, config, polarity, pgClient, polarityPath, logger) {
  if (env.hasOwnProperty('NODE_EXTRA_CA_CERTS')) {
    return `  NODE_EXTRA_CA_CERTS: ${env.NODE_EXTRA_CA_CERTS}`;
  } else {
    return '  NODE_EXTRA_CA_CERTS is not set';
  }
}

module.exports = {
  check,
  name
};
