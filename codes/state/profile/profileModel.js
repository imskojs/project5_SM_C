(function() {
  'use strict';

  angular.module('app')
    .factory('ProfileModel', ProfileModel);

  ProfileModel.$inject = [];

  function ProfileModel() {

    var model = {
      form: {},
      fileArray: [],
      dataArray: []

    };
    return model;
  }
})();
