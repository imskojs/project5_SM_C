(function() {
  'use strict';

  angular.module('app')
    .factory('TestModel', TestModel);

  TestModel.$inject = [];

  function TestModel() {

    var Model = {
      products: []
    };

    return Model;
  }
})();
