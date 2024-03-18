const xml2js = require('xml2js')

/**
 * @memberof Bpm.Api.Access
 */
class Access
{
  constructor(console, messageQueue, bpmnService)
  {
    this.console      = console
    this.messageQueue = messageQueue
    this.bpmnService  = bpmnService
  }

  async dispatch({ route, msg })
  {
    const
      pid         = route.pid,
      endpoint    = route.endpoint,
      bpmn_xml    = await this.messageQueue.redis.hash.read('process', pid),
      bpmn        = await new Promise((resolve, reject) => xml2js.parseString(bpmn_xml, (error, result) => error ? reject(error) : resolve(result))),
      startEvent  = bpmn.definitions.process.reduce((previous, process) => process.startEvent?.find((startEvent) => startEvent.$.name.toLowerCase().replace(' ', '-').replace(/[^a-zA-Z0-9-_]/g, '') === endpoint) ?? previous, null)

    if(startEvent)
    {
      this.console.color('green').log(`✔ triggered: ${pid} → ${endpoint}`)
      return await this.bpmnService.triggerStartEvent(startEvent, this.bpmnService.eventBusManager[pid], msg) ?? 'ok'
    }
    else
    {
      this.console.color('red').log(`✘ can not find start event with name: "${endpoint}" in process: "${pid}"`)
    }
  }
}

module.exports = Access
