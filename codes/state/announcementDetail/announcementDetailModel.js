(function() {
  'use strict';

  angular.module('app')
    .factory('AnnouncementDetailModel', AnnouncementDetailModel);

  AnnouncementDetailModel.$inject = [];

  function AnnouncementDetailModel() {

    var model = {
      comments: [{
        content: 'test test test',
        updatedAt: new Date(),
        createdBy: {
          nickname: 'ko'
        }
      }]
    };
    return model;
  }
})();
