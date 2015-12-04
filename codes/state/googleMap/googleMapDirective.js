(function() {
  'use strict';

  angular.module('app')
    .directive('googleMap', googleMap);

  googleMap.$inject = ['DaumMapModel', 'Places', 'Bookings', 'Products', '$state', '$cordovaGeolocation', 'Message', '$q', '$stateParams', 'daum', 'google', '$window'];

  function googleMap(DaumMapModel, Places, Bookings, Products, $state, $cordovaGeolocation, Message, $q, $stateParams, daum, google, $window) {
    return {
      scope: {
        markerSrc: '@',
        markerClickedSrc: '@',
        markerWidth: '@',
        markerHeight: '@',
      },
      compile: function(element) {
        var DOM = element[0];
        var mapOptions = {
          center: {
            lat: -34.397,
            lng: 150.644
          },
          zoom: 8,
          disableDefaultUI: true
        };
        var map = new google.maps.Map(DOM, mapOptions);
        return function(scope) {};
      } // compile
    }; // return obj
  } // End googleMap
})();
