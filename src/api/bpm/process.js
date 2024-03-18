const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.Bpm
 * @extends {superhero/core/http/server/dispatcher}
 */
class Bpmn extends Dispatcher
{
  async dispatch()
  {
    const 
      messageQueue  = this.locator.locate('message-queue/client'),
      pid           = this.route.dto.pid,
      data          = await messageQueue.redis.hash.read('process', pid)

    this.view.body.pid      = pid
    this.view.body.bpmn_xml = data
  }
}

module.exports = Bpmn
