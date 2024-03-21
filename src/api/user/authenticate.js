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
      user          = this.route.dto.user,
      password      = this.route.dto.password,
      bpmUser       = this.locator.locate('bpm/user'),
      authenticated = await bpmUser.authenticate(user, password)

    if(authenticated)
    {
      // sleep to process the event loop and the eventual consistency
      await new Promise((accept) => setTimeout(accept, 1e3))

      this.session.cookies.set('key', authenticated.key)

      this.view.meta.status         = 302
      this.view.headers['Location'] = '/_bpm'
      this.view.body                = 'Authenticated'
      this.view.template            = 'view/template/successful'
    }
    else
    {
      this.view.meta.status = 401
      this.view.template    = 'view/template/user/login_failed'
    }
  }
}

module.exports = Authenticate
