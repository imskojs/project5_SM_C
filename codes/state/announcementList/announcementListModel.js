(function() {
  'use strict';

  angular.module('app')
    .factory('AnnouncementListModel', AnnouncementListModel);

  AnnouncementListModel.$inject = [];

  function AnnouncementListModel() {

    var model = {
      posts: []

    };
    return model;
  }
})();
