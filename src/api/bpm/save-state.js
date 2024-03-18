const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * TODO!!! rename this to "merge state"
 * 
 * @memberof Bpm.Api.Bpm
 * @extends {superhero/core/http/server/dispatcher}
 */
class BpmnSaveState extends Dispatcher
{
  async dispatch()
  {
    const 
      messageQueue        = this.locator.locate('message-queue/client'),
      domain              = 'bpm/process',
      pid                 = this.route.dto.pid,
      name                = 'saved',
      messageLog          = await messageQueue.readMessageLog(domain, pid),
      filteredMessageLog  = messageQueue.filterMessageLogByName(messageLog, name),
      data                = messageQueue.composeMessageState(filteredMessageLog)

    await messageQueue.write({ domain, pid, name, data })

    for(const message of messageLog)
    {
      await this.deleteMessage(message.id)
    }

    this.view.meta.status = 302
    this.view.headers['Location'] = '/_bpm/process/' + pid
  }
}

module.exports = BpmnSaveState
