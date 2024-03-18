/**
 * @namespace Bpm.Server
 */
module.exports =
{
  core:
  {
    bootstrap:
    {
      'bpm/bpmn' : 'bpm/bpmn'
    },
    dependency:
    {
      '@superhero/core.handlebars'  : '@superhero/core.handlebars',
      '@superhero/core.resource'    : '@superhero/core.resource'
    },
    locator:
    {
      'bpm/*'       : __dirname + '/domain/*',
      'api/access'  : __dirname + '/api/access',
    },
    console:
    {
      maxStringLength : 10e4
    },
    http:
    {
      server:
      {
        timeout: 10 * 1e3,
        routes:
        {
          'authorize':
          {
            middleware  : ['api/user/authorize'],
          },
          'bpm/test':
          {
            url         : '/_bpm/test',
            method      : 'post',
            endpoint    : 'api/bpm/test',
            input       : 'bpm/schema/input/test',
            output      : false,
            permission  : 'admin',
          },
          'bpm/save':
          {
            url         : '/_bpm/save',
            method      : 'post',
            endpoint    : 'api/bpm/save',
            input       : 'bpm/schema/input/save',
            output      : false,
            permission  : 'admin',
          },
          'bpm/save-state':
          {
            url         : '/_bpm/save-state',
            method      : 'post',
            endpoint    : 'api/bpm/save',
            input       : 'bpm/schema/input/save-state',
            output      : false,
            permission  : 'admin',
          },
          'bpm/delete':
          {
            url         : '/_bpm/delete/:pid',
            method      : 'post',
            endpoint    : 'api/bpm/delete',
            input       : 'bpm/schema/input/delete-process',
            output      : false,
            permission  : 'admin',
          },
          'favicon':
          {
            url         : '/favicon.ico',
            endpoint    : 'api/favicon',
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
            directory   : 'view',
            dirname     : '/resource/css',
          },
          'resource/js/modal':
          {
            url         : '/_bpm/resource/js/modal/.+',
            method      : 'get',
            endpoint    : '@superhero/core.resource',
            input       : false,
            permission  : ['public', 'admin'],
            directory   : 'view',
            dirname     : '/resource/js/modal',
          },
          'resource/js':
          {
            url         : '/_bpm/resource/js/.+',
            method      : 'get',
            endpoint    : '@superhero/core.resource',
            input       : false,
            permission  : ['public', 'admin'],
            directory   : 'view',
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
            endpoint    : 'api/user/register_first-user',
            input       : 'bpm/schema/input/register',
            output      : false,
            permission  : ['public', 'admin']
          },
          'login/register':
          {
            url         : '/_bpm/login/register',
            method      : 'post',
            endpoint    : 'api/user/register',
            input       : 'bpm/schema/input/register',
            output      : false,
            permission  : 'admin',
          },
          'login/authenticate':
          {
            url         : '/_bpm/login/authenticate',
            method      : 'post',
            endpoint    : 'api/user/authenticate',
            input       : 'bpm/schema/input/authenticate',
            output      : false,
            permission  : ['public', 'admin'],
          },
          'login/register/form':
          {
            url         : '/_bpm/login/register',
            method      : 'get',
            endpoint    : 'api',
            input       : false,
            output      : false,
            template    : 'view/template/user/register',
            permission  : 'admin',
          },
          'login/register/form/first-user':
          {
            url         : '/_bpm/login/register/first-user',
            method      : 'get',
            endpoint    : 'api/user/register_first-user_form',
            input       : false,
            output      : false,
            template    : 'view/template/user/register_first-user',
            permission  : ['public', 'admin']
          },
          'login':
          {
            url         : '/_bpm/login',
            method      : 'get',
            endpoint    : 'api',
            input       : false,
            output      : false,
            template    : 'view/template/user/login',
            permission  : ['public', 'admin'],
          },
          'logout':
          {
            url         : '/_bpm/logout',
            endpoint    : 'api/user/logout',
            input       : false,
            output      : false,
            permission  : 'admin',
          },
          'bpm/process':
          {
            url         : '/_bpm/process/:pid',
            method      : 'get',
            endpoint    : 'api/bpm/process',
            input       : 'bpm/schema/input/read-process',
            output      : false,
            template    : 'view/template/bpm/process',
            permission  : 'admin',
          },
          'bpm/list':
          {
            url         : '/_bpm',
            method      : 'get',
            endpoint    : 'api/bpm/list',
            input       : false,
            output      : false,
            template    : 'view/template/bpm/list',
            permission  : 'admin',
          },
          'bpm/user/list':
          {
            url         : '/_bpm/team',
            method      : 'get',
            endpoint    : 'api/user/list',
            input       : false,
            output      : false,
            template    : 'view/template/user/list',
            permission  : 'admin',
          },
          'bpm/user/profile':
          {
            url         : '/_bpm/profile',
            method      : 'get',
            endpoint    : 'api',
            input       : false,
            output      : false,
            template    : 'view/template/user/profile',
            permission  : 'admin',
          },
          'bpm/settings':
          {
            url         : '/_bpm/settings',
            method      : 'get',
            endpoint    : 'api/settings',
            input       : false,
            output      : false,
            template    : 'view/template/settings',
            permission  : 'admin',
          },
          'bpm/settings/regenerate-key-pair':
          {
            url         : '/_bpm/settings/regenerate-key-pair',
            method      : 'post',
            endpoint    : 'api/settings/regenerate-key-pair',
            input       : false,
            output      : false,
            template    : 'view/template/settings',
            permission  : 'admin',
          },
          'bpm/settings/git-remote':
          {
            url         : '/_bpm/settings/git-remote',
            method      : 'post',
            endpoint    : 'api/settings/git-remote',
            input       : 'bpm/schema/input/git-remote',
            output      : false,
            template    : 'view/template/settings',
            permission  : 'admin',
          },
          'bpm/fallback':
          {
            url         : '/_bpm/.+',
            endpoint    : 'api/bpm/fallback',
            input       : false,
            output      : false,
            template    : 'view/template/failed',
            permission  : 'admin',
          },
          'access':
          {
            url         : '/:pid/:endpoint',
            endpoint    : 'api/access',
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
        'bpm/schema/input/*'  : __dirname + '/schema/input/*',
      }
    }
  },
  handlebars:
  {
    partials:
    {
      'layout-private'  : 'view/template/layout-private',
      'layout-public'   : 'view/template/layout-public',
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
