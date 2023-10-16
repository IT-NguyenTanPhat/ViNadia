import components from './components';
import authDoc from './auth.doc';
import friendshipDoc from './friendship.doc';
import postDoc from './post.doc';
import userDoc from './user.doc';

export default {
  openapi: '3.1.0',
  info: {
    title: 'Express API for ViNadia',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from Vinadia.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 8080}`,
      description: 'Development',
    },
  ],
  securityDefinitions: {
    API_KEY: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'API key',
    },
  },
  paths: {
    ...friendshipDoc,
    ...postDoc,
    ...userDoc,
    ...authDoc,
  },
  components: {
    ...components,
    securitySchemes: {
      access_token: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjAyMkMwNDYxNjgiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NzA5NzgyNSwiZXhwIjoxNjk3MTI2NjI1fQ.ldiuxcPXlz11vzOkHo6BlSbMMqBakWdXaqtBvtTC_y8',
      },
    },
  },
};
