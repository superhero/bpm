class Cookie
{
  static read(name)
  {
    const cookies = document.cookie.split(';')
    for(const cookie of cookies)
    {
      const pair = cookie.split('=')
      if(pair[0].trim() === name && pair[1])
      {
        return decodeURIComponent(pair[1])
      }
    }
  }

  static write(name, value, samesite = true, secure = true)
  {
    let cookie = [ name, value ].filter(_=>_).map(encodeURIComponent).join('=')

    cookie += '; path=/'

    if(samesite)
    {
      cookie += '; samesite=strict'
    }
    if(secure)
    {
      cookie += '; secure'
    }

    document.cookie = cookie
  }

  static clear()
  {
    const cookies = document.cookie.split(';')
    for(const i in cookies)
    {
      const name = cookies[i].split('=').shift(0, 1).trim()
      document.cookie = name+'=; max-age=-1'
    }
  }
}