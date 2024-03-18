const
  vm              = require('vm'),
  xml2js          = require('xml2js'),
  mysql           = require('mysql'),
  EventEmitter    = require('events'),
  Logger          = require('@superhero/debug'),
  WritableStream  = require('stream').Writable,
  execSync        = require('child_process').execSync

/**
 * @memberof Bpm.Domain
 */
class Bpmn
{
  eventBusManager = {}

  constructor(console, messageQueue, udpServer, coreString)
  {
    this.console      = console
    this.messageQueue = messageQueue
    this.udpServer    = udpServer
    this.coreString   = coreString
  }

  async bootstrap()
  {
    const processes = await this.messageQueue.redis.hash.readAll('process')
    for(const pid in processes)
    {
      this.console.color('yellow').log(`- loading bpm: "${pid}"`)
      const bpmn_xml = processes[pid]

      if(typeof bpmn_xml !== 'string')
      {
        const error = new Error('bpmn process xml is not a string')
        error.code  = 'E_BPMN_XML_NOT_STRING'
        error.chain = { pid, bpmn_xml }
        throw error
      }

      const bpmn = await new Promise((resolve, reject) => xml2js.parseString(bpmn_xml, (error, result) => error ? reject(error) : resolve(result)))
      const dataStore = this.buildDataStore(bpmn)
      this.eventBusManager[pid] = this.buildEventBus(bpmn, dataStore)
      
      for(const process of bpmn.definitions.process || [])
      {
        for(const startEvent of process.startEvent || [])
        {
          if(startEvent.$.udp_port)
          {
            this.udpServer.addSocket(
            {
              dispatcher  : 'api/access',
              socket      : startEvent.$.udp_socket || 'udp4',
              bind        : { port:startEvent.$.udp_port, exclusive:startEvent.$.udp_exclusive || true },
              endpoint    : startEvent.$.name.toLowerCase().replace(' ', '-').replace(/[^a-zA-Z0-9-_]/g, ''),
              pid
            })

            this.console.color('green').log(`✔ loaded udp socket to listen on port: ${startEvent.$.udp_port}`)
          }
        }
      }
    }
  }

  buildDataStore(bpmn)
  {
    const dataStore = {}
    for(const process of bpmn.definitions.process || [])
    {
      for(const dataStoreReference of process.dataStoreReference || [])
      {
        try
        {
          const settings = JSON.parse(dataStoreReference.$.settings)
          dataStore[dataStoreReference.$.id] = mysql.createPool(
          {
            host            : settings.host,
            port            : settings.port,
            user            : settings.user,
            password        : settings.password,
            database        : settings.database,
            connectionLimit : settings.connectionLimit,
            queueLimit      : settings.queueLimit,
            charset         : settings.charset,
            timezone        : settings.timezone,
          })
        }
        catch(error)
        {
          this.console.color('red').log(`✘ could not create a connection to the database, check the settings for the data store: ${dataStoreReference.$.id}`)
        }
      }
    }
    return dataStore
  }

  buildEventBus(bpmn, dataStore)
  {
    const eventBus = new EventEmitter()

    for(const messageFlow of bpmn.definitions.collaboration?.[0].messageFlow || [])
    {
      eventBus.on(messageFlow.$.id, (context) => this.onTargetRef(messageFlow.$.sourceRef, messageFlow.$.targetRef, eventBus, dataStore, context, bpmn))
    }

    for(const process of bpmn.definitions.process || [])
    {
      if((process.sequenceFlow || []).length)
      {
        for(const sequenceFlow of process.sequenceFlow)
        {
          eventBus.on(sequenceFlow.$.id, (context) => this.onTargetRef(sequenceFlow.$.sourceRef, sequenceFlow.$.targetRef, eventBus, dataStore, context, bpmn))
        }
      }
      else
      {
        this.console.color('red').log(`✘ no sequence flow defined in the process diagram`)
      }
    }

    this.console.color('green').log(`✔ loaded eventbus`)

    return eventBus
  }

  triggerStartEvent(startEvent, eventBus, init)
  {
    let log = ''

    return new Promise(async (accept, reject) =>
    {
      const
        timeout = setTimeout(() => 
        {
          const error = new Error('process timeout')
          error.chain = { log }
          error.code  = 'E_BPMN_PROCESS_TIMEOUT'
          reject(error)
        }, startEvent.$.timeout || 10e3),
        clearTimeoutAndAccept = (result) => 
        {
          clearTimeout(timeout)
          accept({ result, log })
        },
        clearTimeoutAndReject = (previousError) => 
        {
          clearTimeout(timeout)
          const error = new Error('error when executing the process')
          error.chain = { previousError, log }
          error.code  = 'E_BPMN_PROCESS_FAILED'
          reject(error)
        }

      for(const outgoingSequenceFlow of startEvent.outgoing || [])
      {
        const
          pid           = (Date.now().toString(32) + Math.random().toString(32).substr(2)).padEnd(20, '0').toUpperCase(),
          messageQueue  = this.messageQueue,
          console       = new Logger(
          {
            colors          : false,
            color           : false,
            date            : false,
            prefix          : pid,
            separator       : ' → ',
            maxArrayLength  : 10,
            maxObjectDepth  : 10,
            maxStringLength : 1e4,
            stdout          : new WritableStream(
            {
              write(chunk, encoding, callback) 
              {
                log += chunk.toString()
                callback()
              }
            })
          })

        eventBus.emit(outgoingSequenceFlow, 
        {
          accept:clearTimeoutAndAccept, 
          reject:clearTimeoutAndReject, 
          ctx:{ require:this.require.bind(this), console, messageQueue, session:{ pid, init }}
        })
      }
    })
  }

  /**
   * lazy load package
   * @param {string} packageName 
   * @param {string} version 
   * @param {string} alias 
   */
  require(packageName, version, alias) 
  {
    const name = alias || packageName

    try 
    {
      // Check if the package is already installed
      return require(name)
    }
    catch(error) 
    {
      let install = packageName

      if(version) install = install + '@' + version
      if(alias)   install = alias   + '=' + install

      // If not installed, install it
      this.console.color('green').log(`✔ installing ${name}...`)
      execSync(`npm install ${install}`, { stdio: 'inherit' })
      return require(name)
    }
  }

  async onTargetRef(sourceRef, targetRef, eventBus, dataStore, context, bpmn)
  {
    const task = bpmn.definitions.process.reduce((previous, process) => process.task?.find((task) => task.$.id === targetRef) ?? previous, null)

    if(task)
    {
      const code = task.$.code ? JSON.parse(Buffer.from(task.$.code, 'base64').toString()) : ''

      if(task.dataOutputAssociation)
      {
        const taskName = this.coreString.splitStringIntoChunks(task.$.name || '', 47).map((chunk) => '│ ' + chunk.padEnd(48, ' ') + '│')

        context.ctx.console.log('')
        context.ctx.console.log('┌─────────────────────────────────────────────────┐')
        context.ctx.console.log('│ Code Task - MySQL                               │')
        context.ctx.console.log('├─────────────────────────────────────────────────┤')
        taskName.forEach((chunk) => context.ctx.console.log(chunk))
        context.ctx.console.log('└─────────────────────────────────────────────────┘')
        context.ctx.console.log('')

        try
        {
          const results = []
          for(const dataOutputAssociation of task.dataOutputAssociation)
          {
            for(const targetRef of dataOutputAssociation.targetRef)
            {
              results.push(await new Promise((accept, reject) => 
                dataStore[targetRef].query(code, context.ctx.session.input, (error, results) =>
                  error 
                  ? reject(error) 
                  : accept(results))))
            }
          }

          context.ctx.session.input = results.length <= 1 ? results[0] : results
        }
        catch(error)
        {
          context.reject(error)
          return
        }
      }
      else
      {
        const taskName = this.coreString.splitStringIntoChunks(task.$.name || '', 47).map((chunk) => '│ ' + chunk.padEnd(48, ' ') + '│')

        context.ctx.console.log('')
        context.ctx.console.log('┌─────────────────────────────────────────────────┐')
        context.ctx.console.log('│ Code Task - JavaScript                          │')
        context.ctx.console.log('├─────────────────────────────────────────────────┤')
        taskName.forEach((chunk) => context.ctx.console.log(chunk))
        context.ctx.console.log('└─────────────────────────────────────────────────┘')
        context.ctx.console.log('')

        try
        {
          const script = new vm.Script(`output = (async () => { ${code} })()`)
          context.ctx.output = null
          script.runInNewContext(context.ctx)
          context.ctx.session.input = await context.ctx.output
          delete context.ctx.output
        }
        catch(previousError)
        {
          const error = new Error('error when executing the task code in a vm')
          error.chain = { previousError, task:task.$.name, code:code, session:context.ctx.session }
          error.code  = 'E_BPMN_TASK_CODE_ERROR'
          context.reject(error)
          return
        }
      }

      for(const outgoingSequenceFlow of task.outgoing || [])
      {
        eventBus.emit(outgoingSequenceFlow, context)
      }
    }
    else
    {
      const exclusiveGateway = bpmn.definitions.process.reduce((previous, process) => process.exclusiveGateway?.find((exclusiveGateway) => exclusiveGateway.$.id === targetRef) ?? previous, null)

      if(exclusiveGateway)
      {
        const exclusiveGatewayName = this.coreString.splitStringIntoChunks(exclusiveGateway.$.name || '', 47).map((chunk) => '│ ' + chunk.padEnd(48, ' ') + '│')

        context.ctx.console.log('')
        context.ctx.console.log('┌─────────────────────────────────────────────────┐')
        context.ctx.console.log('│ Exclusive Gateway                               │')
        context.ctx.console.log('├─────────────────────────────────────────────────┤')
        exclusiveGatewayName.forEach((chunk) => context.ctx.console.log(chunk))
        context.ctx.console.log('└─────────────────────────────────────────────────┘')
        context.ctx.console.log('')

        const gatewayMap = {}
        for(const outgoing of (exclusiveGateway.outgoing || []))
        {
          const 
            sequenceFlow  = bpmn.definitions.process.reduce((previous, process) => process.sequenceFlow?.find((sequenceFlow) => sequenceFlow.$.id === outgoing) ?? previous, null),
            task          = bpmn.definitions.process.reduce((previous, process) => process.task?.find((task) => task.$.id === sequenceFlow.$.targetRef) ?? previous, null)

          gatewayMap[task.$.name] = outgoing
        }

        if(context.ctx.session.input in gatewayMap)
        {
          eventBus.emit(gatewayMap[context.ctx.session.input], context)
        }
        else
        {
          this.console.color('red').log(`✘ input value: "${context.ctx.session.input}" does not match a path in the exclusive gateway`)

          const error = new Error('process error, the input value does not match a path in the exclusive gateway ')
          error.chain = { input:context.ctx.session.input, gatewayMap, exclusiveGateway }
          error.code  = 'E_BPMN_EXCLUSIVE_GATEWAY_NO_MATCHING_PATH'
          context.reject(error)
        }
      }
      else
      {
        const parallelGateway = bpmn.definitions.process.reduce((previous, process) => process.parallelGateway?.find((parallelGateway) => parallelGateway.$.id === targetRef) ?? previous, null)

        if(parallelGateway)
        {
          const parallelGatewayName = this.coreString.splitStringIntoChunks(parallelGateway.$.name || '', 47).map((chunk) => '│ ' + chunk.padEnd(48, ' ') + '│')
  
          context.ctx.console.log('')
          context.ctx.console.log('┌─────────────────────────────────────────────────┐')
          context.ctx.console.log('│ Parallel Gateway                                │')
          context.ctx.console.log('├─────────────────────────────────────────────────┤')
          parallelGatewayName.forEach((chunk) => context.ctx.console.log(chunk))
          context.ctx.console.log('└─────────────────────────────────────────────────┘')
          context.ctx.console.log('')

          context[targetRef] = context[targetRef] || [ ...parallelGateway.incoming ]
          context[targetRef].includes(sourceRef) && context[targetRef].splice(context[targetRef].indexOf(sourceRef), 1)

          if(context[targetRef].length === 0)
          {
            for(const outgoingSequenceFlow of parallelGateway.outgoing || [])
            {
              eventBus.emit(outgoingSequenceFlow, context)
            }
          }
        }
        else
        {
          const 
            intermediateEventProcess  = bpmn.definitions.process.find((process) => process.intermediateThrowEvent?.find((event) => event.$.id === targetRef)),
            intermediateEvent         = intermediateEventProcess?.intermediateThrowEvent?.find((event) => event.$.id === targetRef)

          if(intermediateEvent)
          {
            const intermediateEventName = this.coreString.splitStringIntoChunks(intermediateEvent.$.name || '', 47).map((chunk) => '│ ' + chunk.padEnd(48, ' ') + '│')
    
            context.ctx.console.log('')
            context.ctx.console.log('┌─────────────────────────────────────────────────┐')
            context.ctx.console.log('│ Intermediate Event                              │')
            context.ctx.console.log('├─────────────────────────────────────────────────┤')
            intermediateEventName.forEach((chunk) => context.ctx.console.log(chunk))
            context.ctx.console.log('└─────────────────────────────────────────────────┘')
            context.ctx.console.log('')

            const
              domain = bpmn.definitions.collaboration[0].participant?.find((participant) => participant.$.processRef === intermediateEventProcess.$.id)?.$.name,
              name   = intermediateEvent.$.name

            if(domain)
            {
              if(name)
              {
                try
                {
                  const
                    pid = context.ctx.session.pid,
                    id  = await this.messageQueue.write({ domain, pid, name, data:context.ctx.session.input })

                  context.ctx.session.input = id
                }
                catch(error)
                {
                  context.reject(error)
                  return
                }

                for(const outgoingSequenceFlow of intermediateEvent.outgoing || [])
                {
                  eventBus.emit(outgoingSequenceFlow, context)
                }
              }
              else
              {
                this.console.color('red').log(`✘ could not find an event name for the event to be persisted as, define a name for the intermediate event`)
              }
            }
            else
            {
              this.console.color('red').log(`✘ could not find a domain for the event to be persisted as, define a collaboration pool and set a name for it`)
            }
          }
          else
          {
            const endEvent = bpmn.definitions.process.reduce((previous, process) => process.endEvent?.find((event) => event.$.id === targetRef) ?? previous, null)

            if(endEvent)
            {
              const endEventName = this.coreString.splitStringIntoChunks(endEvent.$.name || '', 47).map((chunk) => '│ ' + chunk.padEnd(48, ' ') + '│')
      
              context.ctx.console.log('')
              context.ctx.console.log('┌─────────────────────────────────────────────────┐')
              context.ctx.console.log('│ End Event                                       │')
              context.ctx.console.log('├─────────────────────────────────────────────────┤')
              endEventName.forEach((chunk) => context.ctx.console.log(chunk))
              context.ctx.console.log('└─────────────────────────────────────────────────┘')
              context.ctx.console.log('')

              context.accept(context.ctx.session.input)
            }
            else
            {
              this.console.color('red').log(`✘ could not find a supported path in the sequence flow, only allowed to use task, exclusive gateway or intermediate event`)
            }
          }
        }
      }
    }

    const messageFlowId = bpmn.definitions.collaboration[0].messageFlow?.find((messageFlow) => messageFlow.$.sourceRef === targetRef)?.$.id

    if(messageFlowId)
    {
      eventBus.emit(messageFlowId, context)
    }
  }
}

module.exports = Bpmn
