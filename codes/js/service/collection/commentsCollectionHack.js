(function() {
  'use strict';

  angular.module('app')
    .factory('CommentsHack', CommentsHack);

  CommentsHack.$inject = ['$resource', 'governorUrl'];

  function CommentsHack($resource, governorUrl) {

    var commentUrl = governorUrl + '/:comment' + '/:find';

    var params = {
      comment: '@comment',
      find: '@find'
    };

    var actions = {
      find: {
        method: 'GET',
        params: {
          comment: 'comment',
          find: 'find'
        }
      }

    };

    var service = $resource(commentUrl, params, actions);

    return service;
  }

})();
