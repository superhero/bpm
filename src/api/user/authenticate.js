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
      messageQueue  = this.locator.locate('message-queue/client'),
      authenticated = await bpmUser.authenticate(user, password)

    if(authenticated)
    {
      // TODO !!! bugfix the message queues wait method, it should be able to wait for one of the paths to take place
      // ... if this is fixed, one does not need to update after the user has been authenticated
      // await messageQueue.wait('bpm/user', 'key/' + authenticated.key, ['authenticated'], ['unauthenticated'], 10e3)

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
