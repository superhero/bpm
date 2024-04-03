const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.User
 * @extends {superhero/core/http/server/dispatcher}
 */
class Authorize extends Dispatcher
{
  async dispatch(next)
  {
    const 
      key         = this.session.cookies.get('key') || this.request.headers['key'],
      bpmUser     = this.locator.locate('bpm/domain/user'),
      authorized  = await bpmUser.authorize(this.route, key)

    if(authorized)
    {
      await next()
    }
    else
    {
      this.view.meta.status = 401
      this.view.body        = 'Not authorized'

      if(key)
      {
        this.view.template = 'view/template/failed'
      }
      else
      {
        this.view.template = 'view/template/user/login'
      }
    }
  }
}

module.exports = Authorize
