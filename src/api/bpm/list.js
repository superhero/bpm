const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.Bpm
 * @extends {superhero/core/http/server/dispatcher}
 */
class BpmnList extends Dispatcher
{
  async dispatch()
  {
    const 
      // TODO: should have a "read all keys" method
      messageQueue  = this.locator.locate('message-queue/client'),
      processes     = await messageQueue.redis.hash.readAll('process'),
      list          = Object.keys(processes)

    list.sort()

    this.view.body.list = list
  }
}

module.exports = BpmnList
