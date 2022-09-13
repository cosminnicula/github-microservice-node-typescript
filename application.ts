import express from 'express';
import * as http from 'http';
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

const application: express.Application = express();
const server: http.Server = http.createServer(application);
const port = process.env.SERVER_PORT;
const routes: CommonRoutesConfig[] = [];

application.use(express.json());
application.use(cors());

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

application.use(expressWinston.logger(loggerOptions));

routes.push(new StatsRoutes(application));

application.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

application.use(handleHttpError);

application.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).send('up')
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
