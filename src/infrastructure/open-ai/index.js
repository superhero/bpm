/**
 * @memberof Bpm.Infrastructure
 */
class OpenAi
{
  constructor(gateway, console)
  {
    this.gateway = gateway
    this.console = console
  }

  async listModels(token)
  {
    const
      url     = '/v1/models',
      headers = { 'Authorization' : 'Bearer ' + token },
      result  = await this.gateway.get({ headers, url })

    if(result.status === 200)
    {
      return result.data.data
    }
    else
    {
      const error = new Error('unexpected status')
      error.chain = { url, data, result }
      error.code  = 'E_BPM_OPEN_AI_LIST_MODELS'
      throw error
    }
  }

  /**
   * @param {array<Bpm.Schema.Entity.Topic>} messages 
   */
  async conclude(token, messages, { model='gpt-3.5-turbo', max_tokens=2e3, temperature=0.9, top_p=0.5, frequency_penalty=0, presence_penalty=0 } = {})
  {
    const
      url     = '/v1/chat/completions',
      headers = { 'Authorization' : 'Bearer ' + token },
      data    =
      {
        // which model version to use
        model,
        // model: 'gpt-4'

        // the input...
        messages,

        // Sets a maximum limit to the length of the generated text
        max_tokens,

        // Influences the randomness of the model's responses
        // A high temperature (close to 1) results in more random outputs, 
        // while a lower temperature (close to 0) makes the output more deterministic and focused
        temperature,

        // when top_p is set to 1, the model considers all tokens, but when top_p is set to, say, 0.5, it only considers the most probable tokens
        top_p,

        // This parameter discourages the model from choosing tokens that it uses frequently. 
        // A higher frequency_penalty means the model is more likely to avoid commonly used tokens in its responses.
        // A number between -2.0 and 2.0
        frequency_penalty,

        // This parameter encourages the model to use new tokens that it hasn't used before. 
        // A higher presence_penalty encourages the model to be more creative and diverse in its choice of tokens.
        // A number between -2.0 and 2.0
        presence_penalty
      },
      result = await this.gateway.post({ headers, url, data })

    this.console.log('...ai input', messages)
    this.console.log('...ai result', result)

    if(result.status === 200)
    {
      if(result.data.choices.length > 1)
      {
        this.console.log('...ai result, more than one choice', result)
      }
      return result.data.choices[0].message.content
    }
    else
    {
      const error = new Error('unexpected status')
      error.chain = { url, data, result }
      error.code  = 'E_BPM_OPEN_AI_CONCLUDE'
      throw error
    }
  }
}

module.exports = OpenAi