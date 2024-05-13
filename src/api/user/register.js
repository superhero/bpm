const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.User
 * @extends {superhero/core/http/server/dispatcher}
 */
class Register extends Dispatcher
{
  async dispatch()
  {
    try
    {
      const 
        user        = this.locator.locate('bpm/domain/user'),
        registered  = await user.register(this.route.dto)
  
      this.view.meta.status         = 302
      this.view.headers['Location'] = '/_bpm/team'
      this.view.body                = 'Registered'
      this.view.template            = 'successful'
    }
    catch(error)
    {
      this.view.meta.status = 412
      this.view.body        = error.message
      this.view.template    = 'failed'
    }
  }
}

module.exports = Register
