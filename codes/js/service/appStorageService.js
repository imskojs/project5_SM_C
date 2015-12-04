//====================================================
//  createdBy;
// Seunghoon Ko (imskojs@gmail.com)
//====================================================

// Dependencies
//ngStorage

(function() {
  'use strict';

  angular.module('app')
    .factory('appStorage', appStorage);

  appStorage.$inject = ['$localStorage', 'appName'];

  function appStorage($localStorage, appName) {
    if (!$localStorage[appName]) {
      $localStorage[appName] = {};
    }
    return $localStorage[appName];
  }
})();
