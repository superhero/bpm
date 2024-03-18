const
  LocatorConstituent  = require('superhero/core/locator/constituent'),
  Bpmn                = require('.')

/**
 * @memberof Bpm.Domain
 * @extends {superhero/core/locator/constituent}
 */
class BpmnLocator extends LocatorConstituent
{
  /**
   * @returns {Bpmn}
   */
  locate()
  {
    const
      console       = this.locator.locate('core/console'),
      messageQueue  = this.locator.locate('message-queue/client'),
      udpServer     = this.locator.locate('core/udp/server'),
      coreString    = this.locator.locate('core/string')

    return new Bpmn(console, messageQueue, udpServer, coreString)
  }
}

module.exports = BpmnLocator
