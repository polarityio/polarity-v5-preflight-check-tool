const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const name = 'Integrations Check';

const dirToValidIntId = (intDir) => {
  return intDir.replace(/([^0-9a-zA-Z])/g, '_');
};

function getIntegrationsFromDisk(integrationsDirectory = '/app/polarity-server/integrations', logger) {
  return fs
    .readdirSync(integrationsDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      let dirName = dirent.name;
      let dirPath = `${integrationsDirectory}/${dirName}`;
      let hasGitDirectory = fs.existsSync(path.join(dirPath, '.git'));
      let configFilePath = path.join(dirPath, 'config', 'config.js');
      let packageJsonPath = path.join(dirPath, 'package.json');
      let hasConfigFile = false;
      let configJs = {};
      let packageJson = {};
      let cwd = process.cwd();

      if (fs.existsSync(configFilePath)) {
        hasConfigFile = true;
        process.chdir(dirPath);
        try {
          configJs = require(configFilePath);
        } catch (configErr) {
          logger.error(`Error loading config.js for ${dirName}`);
          logger.error(configErr);
          configJs = {};
        }

        process.chdir(cwd);
      }

      if (fs.existsSync(packageJsonPath)) {
        packageJson = require(packageJsonPath);
      }

      return {
        dirPath,
        dirName,
        hasGitDirectory,
        configFilePath,
        hasConfigFile,
        configJs,
        packageJson,
        proxyConfigured: _.get(configJs, 'request.proxy', '').length > 0 ? true : false,
        proxyScheme: _.get(configJs, 'request.proxy', '').length > 0 ? configJs.request.proxy.split('://')[0] : 'N/A',
        entityTypes: configJs.entityTypes,
        customTypes: configJs.customTypes
      };
    });
}

async function check(env, config, polarity, pgClient, polarityPath, logger) {
  const report = [];
  const integrations = [];
  const integrationsFromDisk = getIntegrationsFromDisk(path.join(polarityPath, 'integrations'), logger);

  for (const integration of integrationsFromDisk) {
    try {
      const integrationRest = await polarity.getIntegrationById(dirToValidIntId(integration.dirName));

      const {
        status,
        version,
        acronym,
        name,
        description,
        'tls-allow-unauthorized': tlsAllowUnauthorized
      } = integrationRest.data.attributes;

      integration.id = integrationRest.data.id;
      integration.status = status;
      integration.version = version;
      integration.acronym = acronym;
      integration.name = name;
      integration.description = description;
      integration.tlsAllowUnauthorized = tlsAllowUnauthorized;
      integration.proxyConfigured = integration.proxyConfigured;
      integration.proxyScheme = integration.proxyScheme;
      integrations.push(integration);
    } catch (getIntegrationErr) {
      logger.error(getIntegrationErr);
      // This is a rare case where the integration exists on disk but not in the database
      // This means they installed an integration on disk but never restarted the server
      integration.id = 'N/A';
      integration.status = 'Found on disk but not in database';
      integration.version = _.get(integration, 'packageJson.version', 'N/A');
      integration.acronym = _.get(integration, 'configJs.acronym', 'N/A');
      integration.name = _.get(integration, 'configJs.name', 'N/A');
      integration.description = _.get(integration, 'configJs.description', 'N/A');
      integration.tlsAllowUnauthorized = 'N/A';
      integration.proxyConfigured = integration.proxyConfigured;
      integration.proxyScheme = integration.proxyScheme;
      integrations.push(integration);
    }
  }

  integrations.forEach((integration) => {
    report.push(`  Integration: ${integration.name} [${integration.acronym}]`);
    report.push(`    Directory: ${integration.dirName}`);
    report.push(`    Has .git directory: ${integration.hasGitDirectory}`);
    report.push(`    ID: ${integration.id}`);
    report.push(`    Description: ${integration.description}`);
    report.push(`    Version: ${integration.version}`);
    report.push(`    Status: ${integration.status}`);
    report.push(`    TLS Allow Unauthorized: ${integration.tlsAllowUnauthorized}`);
    report.push(`    Proxy is Configured: ${integration.proxyConfigured}`);
    report.push(`    Proxy Scheme: ${integration.proxyScheme}`);

    if (integration.hasConfigFile) {
      if (Array.isArray(integration.entityTypes)) {
        report.push(`    Entity Types: ${integration.entityTypes.join(', ')}`);
      }
      if (Array.isArray(integration.customTypes)) {
        report.push(`    Custom Types:`);
        integration.customTypes.forEach((customType) => {
          report.push(`      Key: ${customType.key}`);
          report.push(`      Regex: ${customType.regex.source}`);
          report.push('');
        });
      }
    } else {
      report.push(`    No config.js file found [${integration.configFilePath}]`);
    }

    report.push('');
  });

  return report.join('\n');
}

module.exports = {
  check,
  name
};
