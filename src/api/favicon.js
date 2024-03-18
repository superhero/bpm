const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api
 * @extends {superhero/core/http/server/dispatcher}
 */
class Favicon extends Dispatcher 
{
  async dispatch() 
  {
    this.view.meta.status = 204
  }
}

module.exports = Favicon
