import { ProjectConfiguration } from 'seed';

export const configs: ProjectConfiguration = {
  mode: process.env.NODE_ENV || 'development',
  port: process.env.PORT || '5000',
  connectionString: process.env.DB_CONN_STRING
};
