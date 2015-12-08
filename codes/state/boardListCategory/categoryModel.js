(function() {
  'use strict';

  angular.module('app')
    .factory('CategoryModel', CategoryModel);

  CategoryModel.$inject = [];

  function CategoryModel() {

    var model = {
      posts: []
    };
    return model;
  }
})();
