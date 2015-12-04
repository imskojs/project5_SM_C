//====================================================
//  createdBy;
// Seunghoon Ko (imskojs@gmail.com)
//====================================================

// Input
// vm.distanceInMeters1 = 10100100
// vm.distanceInMeters2 = 100
// Usage
//<p> {{vm.distanceInMeters1 | mToKm}}</p>
//<p> {{vm.distanceInMeters2 | mToKm}}</p>
// Output
//<p>10100km</p>
//<p>100m</p>
(function() {
  'use strict';
  angular.module('app')
    .filter('mToKm', mToKm);

  mToKm.$inject = [];

  function mToKm() {
    return function(input) {
      if (input >= 1000) {
        return (input / 1000).toFixed(2) + 'km';
      } else {
        return input + 'm';
      }
    };
  }
})();
