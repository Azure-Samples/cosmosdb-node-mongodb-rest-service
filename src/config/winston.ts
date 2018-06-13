import { Logger, transports } from 'winston';

export const logger = new Logger({
  transports: [
    new transports.File({
      filename: 'app.log',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    }),
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      colorize: true
    })
  ]
});
