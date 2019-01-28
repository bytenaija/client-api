var appRoot = require('app-root-path');
var winston = require('winston');

var options = {
    file: {
      level: 'info',
      filename: `${appRoot}/logs/goatti.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
  };

  var logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({format:'MMMM, DD, YYYY - h:m:s'}),
      winston.format.json()
  ),
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
  });

  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    },
  };

  module.exports = logger;