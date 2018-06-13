import swaggerJSDoc = require('swagger-jsdoc');

const config = {
  swaggerDefinition: {
    info: {
      description: 'API documentation.',
      title: 'API',
      version: '1.0.0'
    },
    basePath: '/kvpair'
  },
  apis: ['src/controllers/*.ts']
};

export const swaggerSpec = swaggerJSDoc(config);
