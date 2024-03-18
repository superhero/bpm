/**
 * @memberof Bpm.Schema.Input
 * @typedef {Object} Authenticate
 */
const schema =
{
  'user':
  {
    'type' : 'string'
  },
  'password':
  {
    'type' : 'string'
  },
  'retype-password':
  {
    'type' : 'string'
  }
}

module.exports = schema