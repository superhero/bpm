const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.Access
 * @extends {superhero/core/http/server/dispatcher}
 */
class Access extends Dispatcher
{
  async dispatch()
  {
    this.locator.locate('core/console').color('yellow').log(`dispatching...`, this.request.method, this.request.url)

    const 
      access  = this.locator.locate('api/access'),
      route   = { pid:this.route.dto.pid, endpoint:this.route.dto.endpoint },
      msg     = this.request.body,
      result  = await access.dispatch({ route, msg })

    this.view.body = result
  }
}

module.exports = Access
