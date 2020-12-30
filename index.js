const core = require('@actions/core');
const exec = require('@actions/exec');
const path = require('path');

async function main(){
  try {
    const dryRun = core.getInput('dryRun');
    if (dryRun === 'true')
      console.log('Running in dryRun mode');
    const time = (new Date()).toTimeString();
    const files = JSON.parse(core.getInput('files'));

    const src = core.getInput('src');
    const dest = core.getInput('dest');
    const ftpUsername = core.getInput('ftpUsername');
    const ftpPassword = core.getInput('ftpPassword');
    const ftpHostname = core.getInput('ftpHostname');

    for (let file of files) {
      if (!file.filename.startsWith(src))
        continue;
      const remoteFilePath = file.filename.substr(src.length);
      const remoteDirPath = path.dirname(remoteFilePath);
      const serverPath = `${ftpHostname}/${dest}/${remoteDirPath}/`.replace(/\/{2,}/g, '/');
      const fullFtpPath = `ftp://${serverPath}`;
      console.log(`${file.filename} -> ${fullFtpPath}`);
      if (dryRun !== 'true')
        await exec.exec('curl', ['-s', '-T', file.filename, '--user', `${ftpUsername}:${ftpPassword}`,fullFtpPath])
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
