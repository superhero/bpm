const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.Bpm
 * @extends {superhero/core/http/server/dispatcher}
 */
class BpmnDelete extends Dispatcher
{
  async dispatch()
  {
    const 
      messageQueue  = this.locator.locate('message-queue/client'),
      domain        = 'bpm/process',
      pid           = this.route.dto.pid,
      messageLog    = await messageQueue.readMessageLog(domain, pid),
      state         = messageQueue.composeMessageState(messageLog)

    await messageQueue.redis.hash.write('deleted', pid, state)
    await messageQueue.redis.hash.delete('process', pid)
    await messageQueue.deleteMessageLog(domain, pid)

    this.view.meta.status = 302
    this.view.headers['Location'] = '/_bpm'
  }
}

module.exports = BpmnDelete
