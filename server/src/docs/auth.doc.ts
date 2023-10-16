const authDoc = {
  '/auth/login': {
    post: {
      summary: 'Login.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', example: 'admin@gmail.com' },
                password: { type: 'string', example: '123456' },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Logged in successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    example: '{name: Admin, email: admin@gmail.com}',
                  },
                  access_token: { type: 'string' },
                  refresh_token: { type: 'string' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/InvalidInput' },
      },
    },
  },
  '/auth/register': {
    post: {
      summary: 'Register.',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Admin' },
                email: { type: 'string', example: 'admin@gmail.com' },
                password: { type: 'string', example: '123456' },
              },
              required: ['email', 'password'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Signed up successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    example: '{name: Admin, email: admin@gmail.com}',
                  },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/InvalidInput' },
      },
    },
  },
  '/auth/refresh-token': {
    post: {
      summary: 'Get new access token',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { token: { type: 'string' } },
              required: ['token'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Get access token successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { token: { type: 'string' } },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/InvalidInput' },
      },
    },
  },
};

export default authDoc;
