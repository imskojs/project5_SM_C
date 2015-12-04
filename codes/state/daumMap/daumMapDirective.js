(function() {
  'use strict';

  angular.module('app')
    .directive('daumMap', daumMap);

  daumMap.$inject = ['DaumMapModel', 'Places', 'Bookings', 'Products', '$state', '$cordovaGeolocation', 'Message', '$q', '$stateParams', 'daum'];

  function daumMap(DaumMapModel, Places, Bookings, Products, $state, $cordovaGeolocation, Message, $q, $stateParams, daum) {
    return {
      scope: {
        markerSrc: '@',
        markerClickedSrc: '@',
        markerWidth: '@',
        markerHeight: '@',
      },
      compile: function(element) {
        //==========================================================================
        //              Global Map Property
        //==========================================================================
        var DOM = element[0];
        var mapOptions = {
          center: new daum.maps.LatLng(37.5, 127),
          level: 4,
          draggable: true
        };
        daum.maps.disableHD();
        var map = new daum.maps.Map(DOM, mapOptions);
        var ps = new daum.maps.services.Places();

        //====================================================
        //  IMPLEMENTATIONS COMPILE
        //====================================================
        // Draw Markers after query
        var drawMarkers = function(currentCenter, markerImg, markerClickedImg, scope) {
          resetMarkers();
          requestPlacesWithin(currentCenter)
            .then(processPin.bind(null, markerImg, markerClickedImg, scope))
            .catch(function error(err) {
              console.log(err);
            });
        };
        //====================================================
        //  HELPER
        //====================================================
        function resetMarkers() {
          angular.forEach(DaumMapModel.markers, function(marker) {
            marker.setMap(null);
          });
          DaumMapModel.markers = [];
        }

        function requestPlacesWithin(currentCenter) {
          // Request server for places;
          var PlacesPromise = {};
          if ($stateParams.id) {
            PlacesPromise = Products.findById({
              id: $stateParams.id,
              populates: 'photos'
            }).$promise;
          } else {
            PlacesPromise = Products.getProductWithin({
              type: 'local',
              latitude: currentCenter.latitude,
              longitude: currentCenter.longitude,
              distance: currentCenter.distance || 5000,
              limit: currentCenter.limit || 50,
            }).$promise;
          }
          return PlacesPromise;
        }

        function processPin(markerImg, markerClickedImg, scope, placesWrapper) {
          if ($stateParams.id) {
            DaumMapModel.places = [placesWrapper];
          } else {
            DaumMapModel.places = placesWrapper.products;
          }
          console.log("---------- DaumMapModel.places ----------");
          console.log(DaumMapModel.places);
          console.log("HAS TYPE: " + typeof DaumMapModel.places);
          console.log("---------- CONSOLE END -------------------");


          angular.forEach(DaumMapModel.places, function(place, i) {
            //place = {location:{type:'Point', coordinates:[126.10101, 27.101010]}, ...}
            var placeLongitude = place.geoJSON.coordinates[0];
            var placeLatitude = place.geoJSON.coordinates[1];
            // set marker
            var position = new daum.maps.LatLng(placeLatitude, placeLongitude);
            var marker = new daum.maps.Marker({
              map: map,
              position: position,
              // used as to link to place info
              title: String(i),
              image: markerImg,
              clickable: true
            });
            daum.maps.event.addListener(marker, 'click', function() {
              var marker = this;
              scope.$apply(function() {
                // on click: differentiate clicked image;
                angular.forEach(DaumMapModel.markers, function(otherMarker) {
                  otherMarker.setImage(markerImg);
                });
                marker.setImage(markerClickedImg);
                // on click: show modal which will be filled with place info
                // modal references DaumMapModel.selectedPlace to fill in the info
                var index = Number(marker.getTitle());
                Message.loading();
                Products.findById({
                  id: DaumMapModel.places[index].id,
                  populates: 'photos,createdBy'
                }).$promise
                  .then(function success(data) {
                    Message.hide();
                    DaumMapModel.selectedPlace = data;
                    console.log(data);
                    DaumMapModel.modal.show();
                  }, function error(err) {
                    console.log(err);
                    Message.hide();
                    Message.alert();
                  });
                // DaumMapModel.selectedPlace = DaumMapModel.places[index];
              });
            });
            // Save converted place with click event added.
            DaumMapModel.markers.push(marker);
          });
          Message.hide();
        }

        //====================================================
        //  Functions Exposed to controller via DaumMapModel
        //====================================================
        DaumMapModel.findMeThenSearchNearBy = function(justFind) {
          Message.loading();
          $cordovaGeolocation.getCurrentPosition({
            maximumAge: 3000,
            timeout: 5000
          })
            .then(function success(position) {
              Message.hide();
              if (position.coords == null) {
                Message.alert(
                  '위치 공유가 꺼져있습니다.',
                  '위치 공유를 켜주세요.'
                );
                return false;
              }
              DaumMapModel.currentPosition = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              if (!justFind) {
                map.setCenter(new daum.maps.LatLng(
                  DaumMapModel.currentPosition.latitude,
                  DaumMapModel.currentPosition.longitude
                ));
              }
              // drawMarkers(currentCenter);
            }, function error() {
              Message.hide();
              Message.alert(
                '위치 공유가 꺼져있습니다.',
                '위치 공유를 켜주세요.'
              );
            });
        };


        DaumMapModel.findPlaceByIdThenDrawAPlace = function(id) {
          Message.loading();
          Products.findById({
            id: id,
            populates: 'photos'
          }).$promise
            .then(function success(place) {
              //-------------------------------------------------------
              //  Hacky fix: when coming back to map if the map's center is the same as the
              // place we want to pane to, search does not get called. So make it wiggle a bit.
              //-------------------------------------------------------
              var currentCenter = {
                longitude: map.getCenter().getLng(),
                latitude: map.getCenter().getLat()
              };
              if (Math.abs(currentCenter.longitude - place.geoJSON.coordinates[1]) < 0.00001 && Math.abs(currentCenter.latitude - place.geoJSON.coordinates[0]) < 0.00001) {
                map.panTo(new daum.maps.LatLng(
                  currentCenter.longitude + 0.011,
                  currentCenter.latitude + 0.011
                ));
              }
              //------------------------
              //  Hacky fix ends;
              //------------------------
              map.panTo(new daum.maps.LatLng(
                place.geoJSON.coordinates[1],
                place.geoJSON.coordinates[0]
              ));
              Message.hide();
            }, function error(err) {
              console.log(err);
            });
        };

        DaumMapModel.searchLocationNearBy = function(value) {
          console.log("---------- value daumMapModel searchlocation ----------");
          console.log(value);
          console.log("HAS TYPE: " + typeof value);
          console.log("---------- CONSOLE END -------------------");

          Message.loading();
          if (!value) {
            Message.hide();
            Message.alert('검색하기 알림', '장소 값을 넣어서 다시 검색해주세요');
            return false;
          }
          ps.keywordSearch(value, function(status, data) {
            if (data.places[0] === undefined) {
              Message.hide();
              Message.alert(
                '요청하신 장소가 없습니다',
                '다시검색해주세요'
              );
              return false;
            }
            // move to center of searched result.
            map.panTo(new daum.maps.LatLng(
              data.places[0].latitude,
              data.places[0].longitude
            ));
            // map's center is moved it will drawMarkers().
            Message.hide();
          }, function(err) {
            console.log(err);
            Message.hide();
            Message.alert({
              title: '위치 공유가 꺼져있습니다.',
              template: '위치 공유 켜주세요.'
            });
          });
        };

        return function(scope) {
          // Marker style properties.
          var markerSize = new daum.maps.Size(Number(scope.markerWidth), Number(scope.markerHeight));
          var markerImg = new daum.maps.MarkerImage(scope.markerSrc, markerSize);
          var markerClickedImg = new daum.maps.MarkerImage(scope.markerClickedSrc, markerSize);
          map.relayout();
          DaumMapModel.domMap = map;
          // ------------------------
          //  Search when moved
          // ------------------------
          daum.maps.event.addListener(map, 'idle', function() {
            map.relayout();
            Message.loading();
            var currentCenter = {
              longitude: map.getCenter().getLng(),
              latitude: map.getCenter().getLat()
            };
            angular.extend(currentCenter, {
              distance: 2000,
              limit: 20
            });
            drawMarkers(currentCenter, markerImg, markerClickedImg, scope);
          });
        };
      }
    };
  }

})();
