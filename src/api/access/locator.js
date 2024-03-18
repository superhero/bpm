const
  LocatorConstituent  = require('superhero/core/locator/constituent'),
  Access              = require('./udp-dispatcher')

/**
 * @memberof Bpm.Api.Access
 * @extends {superhero/core/locator/constituent}
 */
class AccessLocator extends LocatorConstituent
{
  /**
   * @returns {Bpmn}
   */
  locate()
  {
    const
      console       = this.locator.locate('core/console'),
      messageQueue  = this.locator.locate('message-queue/client'),
      bpmnService   = this.locator.locate('bpm/bpmn')

    return new Access(console, messageQueue, bpmnService)
  }
}

module.exports = AccessLocator
