const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.User
 * @extends {superhero/core/http/server/dispatcher}
 */
class RegisterFirstUserForm extends Dispatcher
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
      this.view.template  = 'view/template/failed'
    }
  }
}

module.exports = RegisterFirstUserForm
