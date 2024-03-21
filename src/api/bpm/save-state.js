const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.Bpm
 * @extends {superhero/core/http/server/dispatcher}
 */
class BpmnSaveState extends Dispatcher
{
  async dispatch()
  {
    const 
      messageQueue        = this.locator.locate('message-queue/client'),
      // settings            = this.locator.locate('bpm/settings'),
      domain              = 'bpm/process',
      pid                 = this.route.dto.pid,
      name                = 'saved',
      messageLog          = await messageQueue.readMessageLog(domain, pid),
      filteredMessageLog  = messageQueue.filterMessageLogByName(messageLog, name),
      data                = messageQueue.composeMessageState(filteredMessageLog)
      // gitRemote           = await settings.readGitRemote(),
      // gitUser             = await settings.readGitUser(),
      // gitKeyPair          = await settings.readKeyPair()

    if(data === undefined)
    {
      const error = new Error('No state to save')
      error.code  = 'NO_STATE_TO_SAVE'
      error.chain = { pid, messageLog, filteredMessageLog, data }
      throw error
    }

    // if(gitRemote && gitUser)
    // {
    // TODO!!! push to remote branch matching the pid variable
    //         if the branch does not exist, then create it...
    // }

    await messageQueue.write({ domain, pid, name, data })

    for(const message of filteredMessageLog)
    {
      await messageQueue.deleteMessage(message.id)
    }

    this.view.meta.status = 302
    this.view.headers['Location'] = '/_bpm/process/' + pid
  }
}

module.exports = BpmnSaveState
