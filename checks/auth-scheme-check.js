const _ = require('lodash');

const name = 'Authentication Scheme Check';

function getSchemeFromUrl(url) {
  const scheme = url.split('://')[0];
  return scheme;
}

function getDomainFromUrl(url) {
  const domain = url.split('://')[1].split('/')[0];
  return domain;
}

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const setting = await polarity.getServerSetting('authentication');
  let method = _.get(setting, 'data.attributes.value.method', 'local');
  const report = [];

  report.push(`  Auth Method: ${method}`);

  if (method === 'saml') {
    let idp = _.get(setting, 'data.attributes.value.scheme-config.entryPoint', 'Not Set');
    let validateInResponseTo = _.get(setting, 'data.attributes.value.scheme-config.validateInResponseTo', 'Not Set');

    report.push(`  IDP: ${getDomainFromUrl(idp)}`);
    report.push(`  validateInResponseTo: ${validateInResponseTo}`);
  } else if (method === 'ldap') {
    let scheme = _.get(setting, 'data.attributes.value.scheme-config.url', 'Not Set');
    report.push(`  LDAP Scheme: ${getSchemeFromUrl(scheme)}`);
  }

  return report.join('\n');
}

module.exports = {
  check,
  name
};
