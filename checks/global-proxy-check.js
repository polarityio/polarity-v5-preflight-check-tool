const name = 'Global Proxy Check';

function getSchemeFromUrl(url) {
  const scheme = url.split('://')[0];
  return scheme;
}

function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];

  if (env.hasOwnProperty('HTTP_PROXY')) {
    report.push(`  HTTP_PROXY: ${getSchemeFromUrl(env.HTTP_PROXY)} (only the scheme is recorded)`);
  } else {
    report.push('  HTTP_PROXY is not set');
  }

  if (env.hasOwnProperty('HTTPS_PROXY')) {
    report.push(`  HTTPS_PROXY: ${getSchemeFromUrl(env.HTTPS_PROXY)} (only the scheme is recorded)`);
  } else {
    report.push('  HTTPS_PROXY is not set');
  }

  if (env.hasOwnProperty('NO_PROXY')) {
    report.push(`  NO_PROXY: ${env.NO_PROXY}`);
  } else {
    report.push('  NO_PROXY is not set');
  }

  return report.join('\n');
}

module.exports = {
  check,
  name
};
