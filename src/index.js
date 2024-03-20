const
  CoreFactory = require('superhero/core/factory'),
  coreFactory = new CoreFactory,
  core        = coreFactory.create(process.env.BRANCH)

core.add('bpm', __dirname)

core.load()

core.locate('core/bootstrap').bootstrap().then(
  () => core.locate('core/http/server').listen(process.env.HTTP_PORT || 80))