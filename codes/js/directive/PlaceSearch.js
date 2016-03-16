//====================================================
//  Usage
//====================================================

// Injects findPlaces(searchWord) to PostCreate CtrlAsObj
// vm.findPlaces(searchWord) => vm.Model.places: [{}];

// IN HTML
// <div 
//   place-search
//   vm="PostCreate"
// ></div>

// <div class="row zero">
//   <div class="col zero">
//     <input type="text"
//       placeholder="국가 / 지역 / 역(건물) 주변까지 검색하여 입력"
//       ng-model="PostCreate.searchWord"
//       ng-enter="PostCreate.findPlaces(PostCreate.searchWord)"
//     >
//   </div>
//   <div class="col-10 flex"
//     ng-click="PostCreate.findPlaces(PostCreate.searchWord);"
//   >
//     <i class="ion-android-search"></i>
//   </div>
// </div>

// <div
//   ng-if="PostCreate.Model.places.length > 0"
// >
//   <p class="zero">
//     장소를 골라주세요 
//   </p>
//   <div class="row zero row-places"
//     ng-repeat="place in PostCreate.Model.places"
//     ng-click="PostCreate.selectAbroadPlace(place);"
//   >
//     <div class="col zero col-address flex">
//       <p class="zero address-text">
//         {{place.formatted_address}}
//       </p>
//     </div>
//   </div>
// </div>

// IN CONTROLLER
// function selectAbroadPlace(placeObj) {
//   PostCreate.searchWord = placeObj.formatted_address;
//   PostCreateModel.form.address = placeObj.formatted_address;
//   PostCreateModel.form.geoJSON = {
//     type: 'Point',
//     coordinates: [
//       Number(placeObj.geometry.location.lng()),
//       Number(placeObj.geometry.location.lat())
//     ]
//   };
//   PostCreateModel.places = [];
//   $ionicScrollDelegate.resize();
// }

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

    var directiveDefinitionObject = {
      scope: {
        vm: '=',
      },
      compile: function(element) {
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
        return function link(scope) {
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
