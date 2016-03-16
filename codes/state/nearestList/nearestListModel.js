(function() {
  'use strict';

  angular.module('app')
    .factory('NearestListModel', NearestListModel);

  NearestListModel.$inject = [];

  function NearestListModel() {

    var Model = {
      products: []
    };

    return Model;
  }
})();
