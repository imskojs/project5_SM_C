(function() {
  'use strict';

  angular.module('app')
    .factory('Users', Users);


  Users.$inject = ['$resource', 'governorUrl'];

  function Users($resource, governorUrl) {

    var userUrl = governorUrl + '/:auth' + '/:register' + '/:user' + '/:local' +
      '/:checkNickname' + '/:list' + '/:role' + '/:myrole' + '/:update' + '/:updateWithImage' +
      '/:findOne' + ':visit';

    var params = {
      findOne: '@findOne',
      auth: '@auth',
      register: '@register',
      user: '@user',
      checkNickname: '@checkNickname',
      list: '@list',
      role: '@role',
      myrole: '@myrole',
      updateWithImage: '@updateWithImage',
      visit: '@visit'
    };

    var actions = {
      visit: {
        method: 'GET',
        params: {
          user: 'user',
          visit: 'visit'
        }
      },

      findOne: {
        method: 'GET',
        params: {
          user: 'user',
          findOne: 'findOne'
        }
      },
      getUsers: {
        method: 'GET',
        params: {
          user: 'user',
          list: 'list'
        }
      },
      register: {
        method: 'POST',
        params: {
          register: 'register'
        }
      },
      checkNickname: {
        method: 'GET',
        params: {
          user: 'user',
          checkNickname: 'checkNickname'
        }
      },
      login: {
        method: 'POST',
        params: {
          auth: 'auth',
          local: 'local'
        }
      },
      getMyRole: {
        method: 'GET',
        params: {
          role: 'role',
          myrole: 'myrole'
        }
      },
      updateProfileWithImage: {
        method: 'PUT',
        params: {
          user: 'user',
          updateWithImage: 'updateWithImage'
        }
      },
      updateUser: {
        method: 'PUT',
        params: {
          user: 'user',
          update: 'update'
        },
        isArray: true
      }
    };

    var service = $resource(userUrl, params, actions);

    return service;
  }
})();
