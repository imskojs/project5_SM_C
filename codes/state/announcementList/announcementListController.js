(function() {
  'use strict';
  angular.module('app')
    .controller('AnnouncementListController', AnnouncementListController);

  AnnouncementListController.$inject = ['AnnouncementListModel'];

  function AnnouncementListController(AnnouncementListModel) {

    var AnnouncementList = this;
    AnnouncementList.Model = AnnouncementListModel;


    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
  }
})();
