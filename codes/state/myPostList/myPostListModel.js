(function() {
  'use strict';

  angular.module('app')
    .factory('MyPostListModel', MyPostListModel);

  MyPostListModel.$inject = [];

  function MyPostListModel() {

    var model = {
      //====================================================
      //  post lists
      //====================================================
      posts: [],
      selectedPosts: [],
      postsToUpdate: [],
      postsToSetSoldOut: [],
      postsToDestroy: [],
    };
    return model;
  }
})();
