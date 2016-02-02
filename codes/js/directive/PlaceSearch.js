(function() {
  'use strict';

  angular.module('app')
    .directive('placeSearch', placeSearch);

  placeSearch.$inject = [
    '$window', '$timeout', '$state', '$cordovaGeolocation', '$q'
  ];

  function placeSearch(
    $window, $timeout, $state, $cordovaGeolocation, $q
  ) {
    var _ = $window._;

    var directiveDefinitionObject = {
      scope: {
        vm: '=',
      },
      compile: function(element, attrs) {
        var google = $window.google;
        //====================================================
        //  Initial Setup
        //====================================================
        var div = element[0];
        var map = new google.maps.Map(div);
        var geocoder = new google.maps.Geocoder();
        var ps = new google.maps.places.PlacesService(map);

        //====================================================
        //  Compile Implementations
        //====================================================

        //====================================================
        //  Link Function
        //====================================================
        return function link(scope, element, attrs) {
          // functions bind to CtrlAs method
          scope.vm.findPlaces = findPlaces;
          //====================================================
          //  Link Implementation
          //====================================================
          function findPlaces(searchWord) {
            var deferred = $q.defer();
            ps.textSearch({
              query: searchWord
            }, function(results, status) {
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                var latLng = results[0].geometry.location;
                deferred.resolve(latLng);
              } else {
                deferred.reject(status);
              }
            });

            deferred.promise
              .then(function(latLng) {
                var lat = latLng.lat();
                var lng = latLng.lng();

                var deferred = $q.defer();
                geocoder.geocode({
                  location: {
                    lat: lat,
                    lng: lng
                  }
                }, function(results, status) {
                  if (status === google.maps.GeocoderStatus.OK) {
                    deferred.resolve(results);
                  } else {
                    deferred.reject(status);
                  }
                });
                return deferred.promise;
              })
              .then(function(results) {
                console.log("results :::\n", results);
                $timeout(function() {
                  scope.vm.Model.places = results;
                  console.log("scope.vm.Model.places :::\n", scope.vm.Model.places);
                }, 0);
              })
              .catch(function(status) {
                console.log("placeSearch.findPlaces status :::\n", status);
              });
          }

        }; /*link ends*/
      } /*compile ends*/
    }; /* directive definition object ends */

    return directiveDefinitionObject;


  } // google map directive ends
})();
