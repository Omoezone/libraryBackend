import { createLogger, transports, format } from 'winston';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(), 
        format.json() 
    ),
    transports: [
        new transports.File({
            filename: './logs/combined.log',
        }),
        new transports.File({
            filename: './logs/info.log',
            level: 'info',
            maxsize: 1024 * 1024
        }),
        new transports.File({
            filename: './logs/error.log',
            level: 'error',
            maxsize: 1024 * 1024
        }), 
        new transports.Console(),
    ],
});

export default logger;

