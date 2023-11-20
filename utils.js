const { exec } = require('child_process');

async function rpmSearch(rpm) {
  return new Promise((resolve, reject) => {
    // Grep returns an exit code of 1 if there is no match
    exec(`rpm -qa | grep -i "${rpm}"`, (error, stdout, stderr) => {
      if (error) {
        if (error.code === 1) {
          resolve('');
        } else {
          return reject(error);
        }
      }

      if (stderr) {
        return reject(stderr);
      }

      resolve(stdout);
    });
  });
}

module.exports = {
  rpmSearch
};
