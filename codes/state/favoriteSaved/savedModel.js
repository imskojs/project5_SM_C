(function() {
  'use strict';

  angular.module('app')
    .factory('SavedModel', SavedModel);

  SavedModel.$inject = ['MockService'];

  function SavedModel(MockService) {

    var model = {
      //====================================================
      //  post lists
      //====================================================
      posts: []
    };

    // MockService.generatePosts(model.posts, 10);

    return model;
  }
})();
