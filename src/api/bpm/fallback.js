const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.Bpm
 * @extends {superhero/core/http/server/dispatcher}
 */
class BpmnDelete extends Dispatcher
{
  async dispatch()
  {
    this.view.meta.status = 404
    this.view.body = 'Page not found'
  }
}

module.exports = BpmnDelete
