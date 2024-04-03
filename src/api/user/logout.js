const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.User
 * @extends {superhero/core/http/server/dispatcher}
 */
class Authenticate extends Dispatcher
{
  async dispatch()
  {
    const
      key     = this.session.cookies.get('key') || this.request.headers['key'],
      bpmUser = this.locator.locate('bpm/domain/user')

    await bpmUser.logout(key)
    this.session.cookies.set('key', '')

    this.view.body      = 'User have logged out'
    this.view.template  = 'view/template/successful'
  }
}

module.exports = Authenticate
