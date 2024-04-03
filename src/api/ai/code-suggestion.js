const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api
 * @extends {superhero/core/http/server/dispatcher}
 */
class CodeSuggestion extends Dispatcher
{
  async dispatch()
  {
    const ai = this.locator.locate('bpm/infrastructure/open-ai')
    const conclusion = await ai.conclude(token, [ this.route.dto ])

    this.view.meta.status = 200
    this.view.data = conclusion
  }
}

module.exports = CodeSuggestion
