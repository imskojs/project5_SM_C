(function() {
  'use strict';
  angular.module('app')
    .filter('GetBgUpdatePhoto', GetBgUpdatePhoto);

  GetBgUpdatePhoto.$inject = ['$filter'];

  function GetBgUpdatePhoto($filter) {
    return function(Model) {
      if (Model.user.bgPhoto && Model.user.bgPhoto.url) {
        return $filter('cloudinary600')(Model.user.bgPhoto.url);
      } else if (Model.imageDataArray && Model.imageDataArray.length > 0) {
        return Model.imageDataArray[0];
      } else {
        return false;
      }
    };
  }
})();
