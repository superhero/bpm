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
      settings  = this.locator.locate('bpm/domain/settings'),
      publicKey = await settings.lazyloadPublicKey(),
      gitRemote = await settings.readGitRemote(),
      gitUser   = await settings.readGitUser(),
      openAiKey = await settings.readOpenAiKey()

    this.view.body.openAiKey  = openAiKey
    this.view.body.gitRemote  = gitRemote
    this.view.body.gitUser    = gitUser
    this.view.body.publicKey  = publicKey
      .replace('-----BEGIN PUBLIC KEY-----',  '')
      .replace('-----END PUBLIC KEY-----',    '')
      .trim()
  }
}

module.exports = Endpoint
