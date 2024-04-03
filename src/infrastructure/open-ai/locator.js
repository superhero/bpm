const
  OpenAi              = require('.'),
  Request             = require('superhero/core/http/request'),
  LocatorConstituent  = require('superhero/core/locator/constituent')

/**
 * @memberof Bpm.Infrastructure
 */
class OpenAiLocator extends LocatorConstituent
{
  /**
   * @returns {OpenAi}
   */
  locate()
  {
    const 
      configuration   = this.locator.locate('core/configuration'),
      object          = this.locator.locate('core/object'),
      options         = configuration.find('infrastructure/open-ai/gateway'),
      gateway         = new Request(options, object),
      console         = this.locator.locate('core/console')

    return new OpenAi(gateway, console)
  }
}

module.exports = OpenAiLocator