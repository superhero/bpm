const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api
 * @extends {superhero/core/http/server/dispatcher}
 */
class Endpoint extends Dispatcher
{
  async dispatch()
  {
    const settings = this.locator.locate('bpm/settings')
    await settings.persistGitRemote(this.route.dto.remote)

    this.view.meta.status = 302
    this.view.headers['Location'] = '/_bpm/settings'
  }
}

module.exports = Endpoint
