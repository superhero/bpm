const viewDirectory = (__dirname + '/view').substring(require('path').dirname(require.main.filename).length + 1)

console.log('require.main.filename:', require.main.filename)
console.log('viewDirectory:', viewDirectory)

/**
 * @namespace Bpm.Server
 */
module.exports =
{
  core:
  {
    bootstrap:
    {
      'bpm/domain/bpmn' : 'bpm/domain/bpmn'
    },
    dependency:
    {
      '@superhero/core.handlebars'    : '@superhero/core.handlebars',
      '@superhero/core.resource'      : '@superhero/core.resource',
      '@superhero/core.message-queue' : '@superhero/core.message-queue'
    },
    locator:
    {
      'bpm/api/access'        : __dirname + '/api/access',
      'bpm/domain/*'          : __dirname + '/domain/*',
      'bpm/infrastructure/*'  : __dirname + '/infrastructure/*'
    },
    console:
    {
      maxStringLength : 1e5
    },
    http:
    {
      server:
      {
        timeout: 1e4,
        routes:
        {
          'authorize':
          {
            middleware  : [ __dirname + '/api/user/authorize' ],
          },
          'bpm/test':
          {
            url         : '/_bpm/test',
            method      : 'post',
            endpoint    : __dirname + '/api/bpm/test',
            input       : 'bpm/schema/input/test',
            output      : false,
            permission  : 'admin',
          },
          'bpm/save':
          {
            url         : '/_bpm/save',
            method      : 'post',
            endpoint    : __dirname + '/api/bpm/save',
            input       : 'bpm/schema/input/save',
            output      : false,
            permission  : 'admin',
          },
          'bpm/save-state':
          {
            url         : '/_bpm/save-state',
            method      : 'post',
            endpoint    : __dirname + '/api/bpm/save-state',
            input       : 'bpm/schema/input/save-state',
            output      : false,
            permission  : 'admin',
          },
          'bpm/delete':
          {
            url         : '/_bpm/delete/:pid',
            method      : 'post',
            endpoint    : __dirname + '/api/bpm/delete',
            input       : 'bpm/schema/input/delete-process',
            output      : false,
            permission  : 'admin',
          },
          'favicon':
          {
            url         : '/favicon.ico',
            endpoint    : __dirname + '/api/favicon',
            view        : false,
            input       : false,
            output      : false,
            permission  : ['public', 'admin'],
          },
          'resource/css':
          {
            url         : '/_bpm/resource/css/.+',
            method      : 'get',
            endpoint    : '@superhero/core.resource',
            input       : false,
            permission  : ['public', 'admin'],
            directory   : viewDirectory,
            dirname     : '/resource/css',
          },
          'resource/js/modal':
          {
            url         : '/_bpm/resource/js/modal/.+',
            method      : 'get',
            endpoint    : '@superhero/core.resource',
            input       : false,
            permission  : ['public', 'admin'],
            directory   : viewDirectory,
            dirname     : '/resource/js/modal',
          },
          'resource/js':
          {
            url         : '/_bpm/resource/js/.+',
            method      : 'get',
            endpoint    : '@superhero/core.resource',
            input       : false,
            permission  : ['public', 'admin'],
            directory   : viewDirectory,
            dirname     : '/resource/js',
          },
          // HTML views
          'view-html':
          {
            view        : '@superhero/core.handlebars',
          },
          'login/register/first-user':
          {
            url         : '/_bpm/login/register/first-user',
            method      : 'post',
            endpoint    : __dirname + '/api/user/register_first-user',
            input       : 'bpm/schema/input/register',
            output      : false,
            permission  : ['public', 'admin']
          },
          'login/register':
          {
            url         : '/_bpm/login/register',
            method      : 'post',
            endpoint    : __dirname + '/api/user/register',
            input       : 'bpm/schema/input/register',
            output      : false,
            permission  : 'admin',
          },
          'login/authenticate':
          {
            url         : '/_bpm/login/authenticate',
            method      : 'post',
            endpoint    : __dirname + '/api/user/authenticate',
            input       : 'bpm/schema/input/authenticate',
            output      : false,
            permission  : ['public', 'admin'],
          },
          'login/register/form':
          {
            url         : '/_bpm/login/register',
            method      : 'get',
            endpoint    : __dirname + '/api',
            input       : false,
            output      : false,
            template    : __dirname + '/view/template/user/register',
            permission  : 'admin',
          },
          'login/register/form/first-user':
          {
            url         : '/_bpm/login/register/first-user',
            method      : 'get',
            endpoint    : __dirname + '/api/user/register_first-user_form',
            input       : false,
            output      : false,
            template    : __dirname + '/view/template/user/register_first-user',
            permission  : ['public', 'admin']
          },
          'login':
          {
            url         : '/_bpm/login',
            method      : 'get',
            endpoint    : __dirname + '/api',
            input       : false,
            output      : false,
            template    : __dirname + '/view/template/user/login',
            permission  : ['public', 'admin'],
          },
          'logout':
          {
            url         : '/_bpm/logout',
            endpoint    : __dirname + '/api/user/logout',
            input       : false,
            output      : false,
            permission  : 'admin',
          },
          'bpm/process':
          {
            url         : '/_bpm/process/:pid',
            method      : 'get',
            endpoint    : __dirname + '/api/bpm/process',
            input       : 'bpm/schema/input/read-process',
            output      : false,
            template    : __dirname + '/view/template/bpm/process',
            permission  : 'admin',
          },
          'bpm/list':
          {
            url         : '/_bpm',
            method      : 'get',
            endpoint    : __dirname + '/api/bpm/list',
            input       : false,
            output      : false,
            template    : __dirname + '/view/template/bpm/list',
            permission  : 'admin',
          },
          'bpm/user/list':
          {
            url         : '/_bpm/team',
            method      : 'get',
            endpoint    : __dirname + '/api/user/list',
            input       : false,
            output      : false,
            template    : __dirname + '/view/template/user/list',
            permission  : 'admin',
          },
          'bpm/user/profile':
          {
            url         : '/_bpm/profile',
            method      : 'get',
            endpoint    : __dirname + '/api',
            input       : false,
            output      : false,
            template    : __dirname + '/view/template/user/profile',
            permission  : 'admin',
          },
          'bpm/settings':
          {
            url         : '/_bpm/settings',
            method      : 'get',
            endpoint    : __dirname + '/api/settings',
            input       : false,
            output      : false,
            template    : __dirname + '/view/template/settings',
            permission  : 'admin',
          },
          'bpm/settings/regenerate-key-pair':
          {
            url         : '/_bpm/settings/regenerate-key-pair',
            method      : 'post',
            endpoint    : __dirname + '/api/settings/regenerate-key-pair',
            input       : false,
            output      : false,
            template    : __dirname + '/view/template/settings',
            permission  : 'admin',
          },
          'bpm/settings/open-ai-key':
          {
            url         : '/_bpm/settings/open-ai-key',
            method      : 'post',
            endpoint    : __dirname + '/api/settings/open-ai-key',
            input       : 'bpm/schema/input/open-ai-key',
            output      : false,
            template    : __dirname + '/view/template/settings',
            permission  : 'admin',
          },
          'bpm/settings/git-user':
          {
            url         : '/_bpm/settings/git-user',
            method      : 'post',
            endpoint    : __dirname + '/api/settings/git-user',
            input       : 'bpm/schema/input/git-user',
            output      : false,
            template    : __dirname + '/view/template/settings',
            permission  : 'admin',
          },
          'bpm/settings/git-remote':
          {
            url         : '/_bpm/settings/git-remote',
            method      : 'post',
            endpoint    : __dirname + '/api/settings/git-remote',
            input       : 'bpm/schema/input/git-remote',
            output      : false,
            template    : __dirname + '/view/template/settings',
            permission  : 'admin',
          },
          'bpm/fallback':
          {
            url         : '/_bpm/.+',
            endpoint    : __dirname + '/api/bpm/fallback',
            input       : false,
            output      : false,
            template    : __dirname + '/view/template/failed',
            permission  : 'admin',
          },
          'access':
          {
            url         : '/:pid/:endpoint',
            endpoint    : __dirname + '/api/access',
            input       : 'bpm/schema/input/access',
            output      : false,
            view        : 'superhero/core/http/server/view/json',
            permission  : ['public', 'admin'],
          }
        }
      }
    },
    schema:
    {
      composer:
      {
        'bpm/schema/entity/*' : __dirname + '/schema/entity/*',
        'bpm/schema/input/*'  : __dirname + '/schema/input/*',
      }
    }
  },
  handlebars:
  {
    partials:
    {
      'layout-private'  : __dirname + '/view/template/layout-private',
      'layout-public'   : __dirname + '/view/template/layout-public',
    }
  },
  infrastructure:
  {
    'open-ai':
    {
      gateway:
      {
        headers:
        {
          'Content-Type'  : 'application/json'
        },
        url: 'https://api.openai.com/'
      }
    }
  },
  client:
  {
    'message-queue':
    {
      redis:
      {
        gateway :
        {
          url: `redis://127.0.0.1:6379`
        }
      },
      domain  : 'bpm/*',
      name    : '*'
    }
  }
}
