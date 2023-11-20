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

async function fileSearch(file) {
  return new Promise((resolve, reject) => {
    // Grep returns an exit code of 1 if there is no match
    exec(`find /home /root /tmp /app -name ${file} -print -quit`, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        return reject(error);
      }

      if (stderr) {
        console.error(stderr);
        return reject(stderr);
      }

      resolve(stdout);
    });
  });
}

module.exports = {
  rpmSearch,
  fileSearch
};
