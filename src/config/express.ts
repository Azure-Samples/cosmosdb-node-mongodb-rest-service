import { json, urlencoded } from 'body-parser';
import { configs } from 'config/environment';
import { swaggerSpec } from 'config/swagger';
import { logger } from 'config/winston';
import { KvPairController } from 'controllers/KvPairController';
import * as express from 'express';
import { ErrorHandler } from 'middlewares/ErrorHandler';
import * as morgan from 'morgan';
import * as path from 'path';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';

const app = createExpressServer({
  defaultErrorHandler: false,
  classTransformer: false,
  controllers: [KvPairController],
  middlewares: [ErrorHandler]
});

app.use(
  morgan('tiny', {
    stream: {
      write: message => logger.info(message)
    }
  })
);

app.use(json());
app.use(urlencoded({ extended: true }));

// Sets a variable to toggle the different paths to swagger in
// production and development
let swaggerPath: string;
if (configs.mode === 'development') {
  swaggerPath = path.join(__dirname, '../assets/swagger');
} else {
  swaggerPath = path.join(__dirname, '../src/assets/swagger');
}

logger.info(`__dirname is: ${__dirname}`);
app.use('/docs', express.static(swaggerPath));
app.use('/api/swagger', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

export { app };
