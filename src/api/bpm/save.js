const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.Bpm
 * @extends {superhero/core/http/server/dispatcher}
 */
class BpmnSave extends Dispatcher
{
  async dispatch()
  {
    const 
      messageQueue  = this.locator.locate('message-queue/client'),
      domain        = 'bpm/process',
      pid           = this.route.dto.pid.toLowerCase().replace(' ', '-').replace(/[^a-zA-Z0-9-_]/g, '') || Date.now().toString(32),
      name          = 'saved',
      data          = this.route.dto.bpmn_xml

    await messageQueue.write({ domain, pid, name, data })
    await messageQueue.redis.hash.write('process', pid, data)

    this.view.meta.status = 302
    this.view.headers['Location'] = '/_bpm/process/' + pid
  }
}

module.exports = BpmnSave
