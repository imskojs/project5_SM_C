(function() {
  'use strict';
  angular.module('app')
    .controller('AnnouncementDetailController', AnnouncementDetailController);

  AnnouncementDetailController.$inject = ['AnnouncementDetailModel'];

  function AnnouncementDetailController(AnnouncementDetailModel) {

    var AnnouncementDetail = this;
    AnnouncementDetail.Model = AnnouncementDetailModel;


    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
  }
})();
