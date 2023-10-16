const friendshipDoc = {
  '/friendships/:userId': {
    get: {
      summary: "Get user's friend list.",
      security: [{ access_token: [] }],
      parameters: [
        {
          in: 'path',
          name: 'userId',
          description: 'ID of the user',
          schema: { type: 'string' },
          required: true,
        },
      ],
      responses: {
        '200': {
          description: 'Returned data successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  friends: { type: 'array', example: '[id1, id2, ...]' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/InvalidInput' },
        '403': { $ref: '#/components/responses/Forbidden' },
      },
    },
    post: {
      summary: 'Create a friend request.',
      security: [{ access_token: [] }],
      parameters: [
        {
          in: 'path',
          name: 'userId',
          description: 'ID of the user',
          schema: { type: 'string' },
          required: true,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { friendId: { type: 'string' } },
              required: ['friendId'],
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  friendship: {
                    type: 'object',
                    example: '{ from: id1, to: id2}',
                  },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/InvalidInput' },
        '403': { $ref: '#/components/responses/Forbidden' },
      },
    },
    patch: {
      summary: 'Accept a friend request.',
      security: [{ access_token: [] }],
      parameters: [
        {
          in: 'path',
          name: 'userId',
          description: 'ID of the user',
          schema: { type: 'string' },
          required: true,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { friendId: { type: 'string' } },
              required: ['friendId'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Accecpted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  friendship: {
                    type: 'object',
                    example: '{ from: id1, to: id2}',
                  },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/InvalidInput' },
        '403': { $ref: '#/components/responses/Forbidden' },
      },
    },
    delete: {
      summary: 'Reject or unfriend a friend.',
      security: [{ access_token: [] }],
      parameters: [
        {
          in: 'path',
          name: 'userId',
          description: 'ID of the user',
          schema: { type: 'string' },
          required: true,
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { friendId: { type: 'string' } },
              required: ['friendId'],
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Accecpted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Delete friendship successfully',
                  },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/InvalidInput' },
        '403': { $ref: '#/components/responses/Forbidden' },
      },
    },
  },
  '/friendships/:userId/:friendId': {
    get: {
      summary: 'Get friend relationship of two users',
      security: [{ access_token: [] }],
      parameters: [
        {
          in: 'path',
          name: 'userId',
          description: 'ID of the user',
          schema: { type: 'string' },
          required: true,
        },
        {
          in: 'path',
          name: 'friendId',
          description: 'ID of the friend',
          schema: { type: 'string' },
          required: true,
        },
      ],
      responses: {
        '200': {
          description: 'Returned data successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'requested' },
                },
              },
            },
          },
        },
        '403': { $ref: '#/components/responses/Forbidden' },
        '400': { $ref: '#/components/responses/InvalidInput' },
      },
    },
  },
};

export default friendshipDoc;
