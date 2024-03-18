/**
 * @memberof Bpm.Domain
 */
class Settings
{
  constructor(console, messageQueue, crypto)
  {
    this.console      = console
    this.messageQueue = messageQueue
    this.crypto       = crypto
  }

  async lazyloadPublicKey()
  {
    const
      domain        = 'bpm/settings',
      pid           = 'settings/key-pair',
      messageLog    = await this.messageQueue.readMessageLog(domain, pid),
      messageState  = this.messageQueue.composeMessageState(messageLog)

    if('publicKey' in messageState)
    {
      return messageState.publicKey
    }
    else
    {
      const keyPair = await this.regenerateKeyPair()
      return keyPair.publicKey
    }
  }

  async regenerateKeyPair()
  {
    const { publicKey, privateKey } = this.crypto.crypto.generateKeyPairSync('ed25519', 
    {
      publicKeyEncoding: 
      {
        type    : 'spki',
        format  : 'pem'
      },
      privateKeyEncoding: 
      {
        type    : 'pkcs8',
        format  : 'pem'
      }
    })

    const
      domain  = 'bpm/settings',
      pid     = 'settings/key-pair'

    await this.messageQueue.write({ domain, pid, name:'generated', data:{ publicKey, privateKey } })

    return { publicKey, privateKey }
  }

  async readGitRemote()
  {
    const
      domain        = 'bpm/settings',
      pid           = 'settings/git-remote',
      messageLog    = await this.messageQueue.readMessageLog(domain, pid),
      messageState  = this.messageQueue.composeMessageState(messageLog)

    return messageState?.remote
  }

  async persistGitRemote(remote)
  {
    const
      domain  = 'bpm/settings',
      pid     = 'settings/git-remote'

    await this.messageQueue.write({ domain, pid, name:'persisted', data:{ remote }})
  }
}

module.exports = Settings
