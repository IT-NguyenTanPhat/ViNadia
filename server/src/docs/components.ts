const components = {
  responses: {
    InvalidInput: {
      description: 'Missing or invalid input',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Invalid input' },
            },
          },
        },
      },
    },
    NotFound: {
      description: 'Resource not found',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Resource not found' },
            },
          },
        },
      },
    },
    Forbidden: {
      description: 'Resource is not allowed for some users',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Access denied' },
            },
          },
        },
      },
    },
    Inserted: {
      description: 'Stored data to the database successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Inserted successfully' },
            },
          },
        },
      },
    },
    Deleted: {
      description: 'Deleted data successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Deleted successfully' },
            },
          },
        },
      },
    },
  },
};

export default components;
