(function() {
  'use strict';

  angular.module('app')
    .factory('MyPageUpdateModel', MyPageUpdateModel);

  MyPageUpdateModel.$inject = [];

  function MyPageUpdateModel() {

    var model = {
      user: {},
      imageFileArray: [],
      imageDataArray: []
    };
    return model;
  }
})();
