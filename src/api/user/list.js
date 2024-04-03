const Dispatcher = require('superhero/core/http/server/dispatcher')

/**
 * @memberof Bpm.Api.User
 * @extends {superhero/core/http/server/dispatcher}
 */
class List extends Dispatcher
{
  async dispatch()
  {
    const 
      bpmUser = this.locator.locate('bpm/domain/user'),
      list    = await bpmUser.listAll()

    this.view.body.list = list
  }
}

module.exports = List
