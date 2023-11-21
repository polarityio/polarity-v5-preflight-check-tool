# Polarity v5 Pre-Flight Check Tool

The Polarity v5 Pre-Flight Check Tool will generate a report to help the Polarity Customer Success team plan your v5 upgrade.  The tool will generate a report that includes:

* Analyst Telemetry Check
* Authentication Scheme Check
* Auto-Updates Check
* Config.js TLS Options Check
* Global Proxy Check
* Integrations Check
* Elastic/Splunk RPM Agent Check
* Node Extra CA Certs Check
* Operating System Check 
* PostgreSQL SSL mode Check
* Polarity Version Check
* Redis Env Var Check
* SMTP Check
* Polarity User Creation Check
* Polarity CLI Integration Search Tool Check
* Polarity Integration Auto Subscribe Check
* Polarity CSV Loader Check
* Polarity Annotation Manager Check

## Usage

This CLI tool is built on NodeJS.  You will need a NodeJS runtime > v12.  To begin, checkout the repository:

```
git clone https://github.com/polarityio/polarity-v5-preflight-check-tool
cd polarity-v5-preflight-check-tool
```

Next, you will need to install the project dependencies using the node package manager:

```
npm ci --production
```

Finally, to run the CLI tool ensure the `polarity-integration-auto-subscribe.sh` script is executable.

```bash
chmod a+x polarity-v5-preflight-check-tool.sh
```

You can now run the CLI tool and pass in the required options. Here is an example with the minimum required options.  This command will generate a report file called `polarity-upgrade-report.txt`.

The provided Polarity user must be a local admin account.  You should wrap the `<PASSWORD>` in single quotes.

```
sudo ./polarity-v5-preflight-check-tool.sh  --rejectUnauthorized=false --url https://localhost --username <USERNAME> --password '<PASSWORD>'
```

## All Options

```
Generate a v5 preflight upgrade report

Options:
  --help                Show help  [boolean]
  --version             Show version number  [boolean]
  --username            Polarity Username to authenticate as  [string]
  --password            Password for the given Polarity username  [string]
  --url                 Polarity server url to include schema  [string] [required]
  --config              Path to the Polarity Server's config file.  [string] [default: "/app/polarity-server/config/config.js"]
  --env                 Path to the Polarity Server's .env file.  [string] [default: "/app/polarity-server/.env"]
  --polarityPath        Path to the Polarity Server Directory  [string] [default: "/app/polarity-server"]
  --rejectUnauthorized  If provided, the loader will reject unauthorized SSL connections  [boolean] [default: true]
  --proxy               If provided, the connection to the Polarity server will use the provided proxy setting  [string] [default: ""]
  --logging             The logging level for the script.  [string] [choices: "simple", "error", "warn", "info", "debug", "trace"] [default: "simple"]
```

