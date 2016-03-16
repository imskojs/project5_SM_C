(function() {
  'use strict';

  angular.module('app')
    .factory('MyPageModel', MyPageModel);

  MyPageModel.$inject = [];

  function MyPageModel() {

    var model = {
      user: {},
      hostUser: {
        visitCount: 0
      },
      products: [],
      imageFileArray: [],
      imageDataArray: []
    };
    return model;
  }
})();
