/**
 * @memberof Bpm.Domain
 */
class User
{
  constructor(console, messageQueue, crypto)
  {
    this.console      = console
    this.messageQueue = messageQueue
    this.crypto       = crypto
  }

  async listAll()
  {
    const
      domain          = 'bpm/user',
      userPidPattern  = 'user/*',
      channel         = this.messageQueue.channel.messageLog(domain, userPidPattern),
      keys            = this.messageQueue.redis.key.scan(channel),
      list            = []

    for await (const user of keys) 
    {
      list.push(user.split('/').pop())
    }

    return list
  }

  async usersExists()
  {
    const
      domain      = 'bpm/user',
      pidPattern  = 'user/*'

    return await this.messageQueue.doesMessageLogExist(domain, pidPattern)
  }

  async userExist(user)
  {
    const
      domain      = 'bpm/user',
      pid         = 'user/' +  user,
      messageLog  = await this.messageQueue.readMessageLog(domain, pid)

    return messageLog.length > 0
  }

  async authenticate(user, password)
  {
    const
      domain      = 'bpm/user',
      pid         = 'user/' + user,
      messageLog  = await this.messageQueue.readMessageLog(domain, pid)

    if(messageLog.length === 0)
    {
      return false
    }

    if(messageLog[0].data.password === this.hash(password, messageLog[0].data.salt))
    {
      const
        key     = Date.now().toString(16) + '.' + this.crypto.randomBytes(32, 'hex'),
        domain  = 'bpm/user',
        pid     = 'key/' + key,
        name    = 'authenticated',
        data    = { user },
        message = { domain, pid, name, data }

      await this.messageQueue.write(message)

      return { key }
    }
  }

  async authorize(route, key)
  {
    let role = 'public'

    //    route.endpoint === 'api/favicon'
    // || route.endpoint === '@superhero/core.resource'
    // || this.console.log('authorize', route, key)

    if(key)
    {
      const
        domain        = 'bpm/user',
        pid_key       = 'key/' + key,
        keyMessageLog = await this.messageQueue.readMessageLog(domain, pid_key),
        authenticated = keyMessageLog[0]?.name === 'authenticated' 
                      && false === keyMessageLog.some((message) => message.name === 'unauthenticated')

      //    route.endpoint === 'api/favicon'
      // || route.endpoint === '@superhero/core.resource'
      // || this.console.log('keyMessageLog', keyMessageLog, 'authenticated', authenticated)
  
      if(authenticated)
      {
        const 
          pid_user        = 'user/' + keyMessageLog[0].data.user,
          userMessageLog  = await this.messageQueue.readMessageLog(domain, pid_user)

        //    route.endpoint === 'api/favicon'
        // || route.endpoint === '@superhero/core.resource'
        // || this.console.log('userMessageLog', userMessageLog)

        role = userMessageLog.reduce((state, message) => message.data.role ?? state, role)
      }
    }

    const
      permissions = Array.isArray(route.permission) ? route.permission : [ route.permission ],
      authorized  = permissions.includes(role)

    //    route.endpoint === 'api/favicon'
    // || route.endpoint === '@superhero/core.resource'
    // || this.console.log('permissions', permissions, 'role', role, 'authorized', authorized)

    return authorized
  }

  async logout(key)
  {
    const
      domain      = 'bpm/user',
      pid         = 'key/' + key,
      name        = 'unauthenticated',
      messageLog  = await this.messageQueue.readMessageLog(domain, pid)

    if(messageLog.length > 0
    && messageLog.pop().name !== name)
    {
      await this.messageQueue.write({ domain, pid, name })
    }
  }

  async register(dto)
  {
    const 
      user      = dto.user,
      password  = dto.password,
      retyped   = dto['retype-password'],
      userExist = await this.userExist(user)

    if(userExist)
    {
      const error = new Error('user already exist')
      error.chain = { user }
      error.code  = 'BPM_USER_REGISTER_USER_ALREADY_EXIST'
      throw error
    }

    if(password !== retyped)
    {
      const error = new Error('passwords does not match')
      error.chain = { user }
      error.code  = 'BPM_USER_REGISTER_PASSWORDS_DOES_NOT_MATCH'
      throw error
    }

    // TODO: validate if user is an email

    const
      domain          = 'bpm/user',
      pid             = 'user/' + user,
      name            = 'registered',
      salt            = this.crypto.randomBytes(32, 'hex'),
      hashedPassword  = this.hash(password, salt),
      data            = { role:'admin', salt, password:hashedPassword },
      message         = { domain, pid, name, data }

    await this.messageQueue.write(message)

    return { user }
  }

  hash(password, salt)
  {
    const 
      iterations  = 12e3,
      keyLength   = 64,
      algorithm   = 'sha512',
      hash        = require('crypto').pbkdf2Sync(password, salt, iterations, keyLength, algorithm)

    return hash.toString('hex')
  }
}

module.exports = User
