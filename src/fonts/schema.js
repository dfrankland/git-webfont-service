export default {
  $schema: 'http://json-schema.org/draft-06/schema#',
  description: 'Schema for validating font settings.',
  type: 'object',
  additionalProperties: false,
  minProperties: 1,
  patternProperties: {
    '^[0-9a-zA-Z-_. ()]*$': {
      type: 'object',
      required: ['url', 'weights'],
      properties: {
        url: {
          type: 'string',
        },
        weights: {
          type: 'object',
          additionalProperties: false,
          minProperties: 1,
          patternProperties: {
            '^[1-9]00i?$': {
              type: 'object',
              properties: {
                eot: {
                  type: 'string',
                },
                woff2: {
                  type: 'string',
                },
                woff: {
                  type: 'string',
                },
                ttf: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};
