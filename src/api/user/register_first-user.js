const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.User
 * @extends {superhero/core/http/server/dispatcher}
 */
class RegisterFirstUser extends Dispatcher
{
  async dispatch()
  {
    const 
      user        = this.locator.locate('bpm/domain/user'),
      usersExists = await user.usersExists()

    if(usersExists)
    {
      this.view.status    = 401
      this.view.body      = 'Not allowed to add another "first" user when users already exists'
      this.view.template  = 'failed'
    }
    else
    {
      const registered = await user.register(this.route.dto)

      this.view.meta.status         = 302
      this.view.headers['Location'] = '/_bpm/login'
      this.view.body                = 'Registered'
      this.view.template            = 'successful'
    }
  }
}

module.exports = RegisterFirstUser
