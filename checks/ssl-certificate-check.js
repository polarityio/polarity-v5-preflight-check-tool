const name = 'SSL Certificate Check';
const { get } = require('lodash');
const { exec } = require('child_process');

async function certIsPkcs8(config) {
  const privateKeyPath = get(config, 'rest.credentials.key', '/etc/pki/tls/private/server.key');

  return new Promise((resolve, reject) => {
    exec(`cat ${privateKeyPath} | grep -i "BEGIN RSA PRIVATE KEY"`, (error, stdout, stderr) => {
      if (error) {
        // Grep returns an exit code of 1 if there is no match
        if (error.code === 1) {
          // There was no match for BEGIN RSA PRIVATE KEY so we assume the cert is PKCS8
          resolve(true);
        } else {
          resolve(false);
        }
      }

      if (stderr) {
        return reject(stderr);
      }

      resolve(false);
    });
  });
}

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const isPkcs8 = await certIsPkcs8(config);
  if (isPkcs8) {
    return '  SSL Certificate is PKCS8';
  } else {
    return '  SSL Certificate is not PKCS8';
  }
}

module.exports = {
  check,
  name
};
