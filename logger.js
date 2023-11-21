const winston = require('winston');

class Logger {
  init(level) {
    this.level = level;
    if (level !== 'simple') {
      const winstonOptions = {
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'polarity-v5-preflight-check-tool' },
        transports: [new winston.transports.Console()]
      };

      this.logger = winston.createLogger(winstonOptions);
    } else {
      this.logger = console;
    }
  }

  simple() {
    this.logger.info(...arguments);
  }

  simpleLine() {
    process.stdout.write(...arguments);
  }

  info() {
    if (this.level !== 'simple') {
      this.logger.info(...arguments);
    }
  }

  debug() {
    if (this.level !== 'simple') {
      this.logger.debug(...arguments);
    }
  }

  trace() {
    if (this.level !== 'simple') {
      this.logger.trace(...arguments);
    }
  }

  error() {
    this.logger.error(...arguments);
  }

  warn() {
    if (this.level !== 'simple') {
      this.logger.warn(...arguments);
    }
  }
}

module.exports = new Logger();
