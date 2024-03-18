const
  LocatorConstituent  = require('superhero/core/locator/constituent'),
  Settings            = require('.')

/**
 * @memberof Bpm.Domain
 * @extends {superhero/core/locator/constituent}
 */
class SettingsLocator extends LocatorConstituent
{
  /**
   * @returns {Bpmn}
   */
  locate()
  {
    const
      console       = this.locator.locate('core/console'),
      messageQueue  = this.locator.locate('message-queue/client'),
      crypto        = this.locator.locate('core/crypto')

    return new Settings(console, messageQueue, crypto)
  }
}

module.exports = SettingsLocator
