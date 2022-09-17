import express, { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import * as dotenv from 'dotenv'
dotenv.config()
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerDocument = YAML.load('./swagger-openapi3.yml');

import { CommonRoutesConfig } from './src/application/config/commonRoutes.config';
import { handleHttpError } from './src/application/exception/middleware/exceptionHandler.middleware';
import { StatsRoutes } from './src/stats/stats.routes.config';
import { handleMediaType } from './src/application/exception/middleware/mediaTypeHandler.middleware';

const application: Application = express();
const routes: CommonRoutesConfig[] = [];

application.use(express.json());
application.use(cors());
application.use(express.urlencoded({ extended: true }));

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false;
}

// 3-rd party middleware
application.use(expressWinston.logger(loggerOptions));

// pre-request custom middleware
application.use(handleMediaType);

// application routes
routes.push(new StatsRoutes(application));

// swagger route
application.use('/swagger-ui', swaggerUi.serve);
application.get('/swagger-ui', swaggerUi.setup(swaggerDocument));

// health route
application.get('/health', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).send('up')
});

// post-request custom middleware
application.use(handleHttpError);

export default application;
