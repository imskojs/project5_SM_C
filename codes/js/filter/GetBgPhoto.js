(function() {
  'use strict';
  angular.module('app')
    .filter('GetBgPhoto', GetBgPhoto);

  GetBgPhoto.$inject = ['$filter'];

  function GetBgPhoto($filter) {
    return function(user) {
      if (user.bgPhoto && user.bgPhoto.url) {
        return $filter('cloudinary600')(user.bgPhoto.url);
      } else {
        return 'img/store_noimg.jpg';
      }
    };
  }
})();
