const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.Bpm
 * @extends {superhero/core/http/server/dispatcher}
 */
class BpmnTest extends Dispatcher
{
  async dispatch()
  {
    const
      xml2js      = require('xml2js'),
      bpmnService = this.locator.locate('bpm/domain/bpmn'),
      bpmn        = await new Promise((resolve, reject) => xml2js.parseString(this.route.dto.bpmn_xml, (error, result) => error ? reject(error) : resolve(result))),
      dataStore   = bpmnService.buildDataStore(bpmn),
      eventBus    = bpmnService.buildEventBus(bpmn, dataStore),
      log         = []

    // this.locator.locate('core/console').log(this.route.dto.bpmn_xml)
    // delete bpmn.definitions['bpmndi:BPMNDiagram']
    // this.locator.locate('core/console').log(bpmn)

    for(const process of bpmn.definitions.process || [])
    {
      if((process.startEvent || []).length)
      {
        for(const startEvent of process.startEvent)
        {
          const inputs = startEvent.$.input ? JSON.parse(Buffer.from(startEvent.$.input, 'base64').toString()) : []

          if(inputs.length)
          {
            for(let input of inputs)
            {
              const enabled = input._enabled
              
              if(enabled === 'on')
              {
                delete input._enabled

                const
                  init    = 'raw input, no schema' in input ? input['raw input, no schema'] : input,
                  output  = await bpmnService.triggerStartEvent(startEvent, eventBus, init)

                this.locator.locate('core/console').color('green').log(`✔ result:`, output.result)
                log.push(output.log)
              }
              else
              {
                this.locator.locate('core/console').color('yellow').log(`- input for endpoint: "${startEvent.$.name}" is not enabled, will not test input`)
              }
            }
          }
          else
          {
            this.locator.locate('core/console').color('red').log(`✘ start event ${startEvent.$.id} does not have any input, did not emit to start it`)
          }
        }
      }
      else
      {
        this.locator.locate('core/console').color('red').log(`✘ no start event defined in the process: ${process.$.id}, not possible to emit to start`)
      }
    }

    // once we done with the test, we remove all listeners and close the connections to the db

    eventBus.removeAllListeners()
    for(const key in dataStore)
    {
      dataStore[key].end()
    }

    this.locator.locate('core/console').log(log)

    this.view.body = log
  }
}

module.exports = BpmnTest
