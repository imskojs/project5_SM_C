(function() {
  'use strict';

  angular.module('app')
    .factory('AnnouncementModel', AnnouncementModel);

  AnnouncementModel.$inject = [];

  function AnnouncementModel() {

    var model = {};
    return model;
  }
})();
