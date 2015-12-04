(function() {
  'use strict';
  angular.module('app')
    .controller('AnnouncementController', AnnouncementController);

  AnnouncementController.$inject = ['AnnouncementModel'];

  function AnnouncementController(AnnouncementModel) {

    var Announcement = this;
    Announcement.Model = AnnouncementModel;


    //------------------------
    //  IMPLEMENTATIONS
    //------------------------

  }
})();
