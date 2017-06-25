export default {
  $schema: 'http://json-schema.org/draft-06/schema#',
  description: 'Schema for validating a query for fonts.',
  type: 'object',
  additionalProperties: false,
  required: ['fonts'],
  properties: {
    fonts: {
      type: 'array',
      minItems: 1,
      uniqueItems: true,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['family', 'weights'],
        properties: {
          family: {
            type: 'string',
            pattern: '^[0-9a-zA-Z-_. ()]*$',
          },
          weights: {
            type: 'array',
            minItems: 1,
            uniqueItems: true,
            items: {
              type: 'string',
              pattern: '^[1-9]00i?$',
            },
          },
        },
      },
    },
  },
};
