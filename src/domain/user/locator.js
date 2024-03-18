const
  LocatorConstituent  = require('superhero/core/locator/constituent'),
  User                = require('.')

/**
 * @memberof Bpm.Domain
 * @extends {superhero/core/locator/constituent}
 */
class UserLocator extends LocatorConstituent
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

    return new User(console, messageQueue, crypto)
  }
}

module.exports = UserLocator
