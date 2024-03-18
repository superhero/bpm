const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api
 * @extends {superhero/core/http/server/dispatcher}
 */
class Endpoint extends Dispatcher
{
  async dispatch()
  {
    const
      settings  = this.locator.locate('bpm/settings'),
      publicKey = await settings.lazyloadPublicKey(),
      gitRemote = await settings.readGitRemote()

    this.view.body.gitRemote = gitRemote
    this.view.body.publicKey = publicKey
      .replace('-----BEGIN PUBLIC KEY-----',  '')
      .replace('-----END PUBLIC KEY-----',    '')
      .trim()
  }
}

module.exports = Endpoint
