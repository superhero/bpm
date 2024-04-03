/**
 * @memberof Bpm.Schema.Entity
 * @typedef {Object} Topic
 */
const schema =
{
  'role':
  {
    'type' : 'string',
    'enum' : 
    [
      'system',
      'assistant',
      'user',
    ],
    'default' : 'user'
  },
  'content':
  {
    'type'      : 'string',
    'not-empty' : true
  }
}

module.exports = schema