const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.User
 * @extends {superhero/core/http/server/dispatcher}
 */
class Register extends Dispatcher
{
  async dispatch()
  {
    const 
      user        = this.locator.locate('bpm/domain/user'),
      registered  = await user.register(this.route.dto)

    this.view.body = registered
  }
}

module.exports = Register
