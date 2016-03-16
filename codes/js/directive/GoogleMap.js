(function() {
  'use strict';

  angular.module('app')
    .directive('googleMap', googleMap);

  googleMap.$inject = [
    '$window', '$timeout', '$state', '$cordovaGeolocation',
    'Message', 'appStorage'
  ];

  function googleMap(
    $window, $timeout, $state, $cordovaGeolocation,
    Message, appStorage
  ) {
    var _ = $window._;

    // Required Input
    // scope.vm: <Object>CtrlAsObject 
    // scope.places: <Array>{ geoJSON: { type: 'Point', coordinates: <Array>Number } } 
    // atrs.id: String
    // EventListener: <Event>(EventName: '$rootScope:dataBindComplete', data: null)
    // EventListener: <Event>(EventName: 'view.afterEnter', data: null) 

    // Optional Input
    // attrs.icon: <String>imgUrl
    // attrs.activeIcon: <String>imgUrl
    // attrs.centerMarker: <String>Boolean
    // attrs.idleEvent: <String>Boolean

    // Output =>
    // vm.setCenterByAddress: (address: String) => void
    // vm.setCEnterByCurrentPosition: () => $qPromise
    // EventEmitter: <Event>(EventName: 'googleMap:featureClicked', data: <String>Place.id)
    // EventEmitter: <Event>(EventName: 'googleMap:centerChanged', data: <Object>{lat: Number, lng: Number})
    var directiveDefinitionObject = {
      scope: {
        vm: '=',
        places: '='
      },
      compile: function(element, attrs) {
        var google = $window.google;
        //====================================================
        //  Initial Setup
        //====================================================
        attrs.$set('dataTapDisabled', true);
        element.css({
          height: '100%',
          width: '100%'
        });
        var div = element[0];

        if (!appStorage[attrs.id]) {
          appStorage[attrs.id] = {
            lastCenter: {
              lat: null,
              lng: null
            }
          };
        }
        if (!appStorage[attrs.id].lastCenter.lat || !appStorage[attrs.id].lastCenter.lng) {
          appStorage[attrs.id].lastCenter.lat = 37.497942;
          appStorage[attrs.id].lastCenter.lng = 127.027621;
        }
        var mapOptions = {
          center: appStorage[attrs.id].lastCenter,
          zoom: 15,
          streetViewControl: true,
          scaleControl: false,
          rotateControl: false,
          zoomControl: false,
          mapTypeControl: false
        };

        var map = new google.maps.Map(div, mapOptions);
        var geocoder = new google.maps.Geocoder();
        var ps = new google.maps.places.PlacesService(map);
        var myMarker; /* available when center-marker="true"*/
        if (attrs.icon) { /*set marker image*/
          map.data.setStyle({
            icon: attrs.icon
          });
        }

        //====================================================
        //  Compile Implementations
        //====================================================
        function setCenterByPlace(searchWord) {
          console.log("'searchPlace' :::\n", 'searchPlace');
          ps.textSearch({
            query: searchWord
          }, function(results, status) {
            console.log("results[0] :::\n", results[0]);
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              map.setCenter(results[0].geometry.location);
              if (attrs.centerMarker === 'true') {
                if (myMarker) {
                  myMarker.setMap(null);
                }
                myMarker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location,
                  draggable: true
                });
                myMarker.addListener('dragend', function() {
                  map.setCenter(myMarker.getPosition());
                });
              }
            } else {
              console.log("googleMap.searchPlace status :::\n", status);
            }
          });
        }
        // (address: String) => void
        function setCenterByAddress(address) {
          geocoder.geocode({
            address: address
          }, function(results, status) {
            console.log("results :::\n", results);
            if (status === google.maps.GeocoderStatus.OK) {
              map.setCenter(results[0].geometry.location);
              if (attrs.centerMarker === 'true') {
                if (myMarker) {
                  myMarker.setMap(null);
                }
                myMarker = new google.maps.Marker({
                  map: map,
                  position: results[0].geometry.location,
                  draggable: true
                });
                myMarker.addListener('dragend', function() {
                  map.setCenter(myMarker.getPosition());
                });
              }
            } else {
              console.log("googleMap.setCenterByAddress :::\n", status);
            }
          });
        }

        // () => $qPromise
        function setCenterByCurrentPosition() {
          Message.loading();
          return $cordovaGeolocation.getCurrentPosition({
            maximumAge: 10000,
            timeout: 7000
          }).then(function(position) {
            Message.hide();
            if (position.coords == null) {
              Message.alert(
                '위치 공유가 꺼져있습니다.',
                '위치 공유를 켜주세요.'
              );
              return false;
            }
            var centerLatLng = new google.maps.LatLng(
              Number(position.coords.latitude),
              Number(position.coords.longitude)
            );
            map.setCenter(centerLatLng);
            if (attrs.centerMarker === 'true') {
              if (myMarker) {
                myMarker.setMap(null);
              }
              myMarker = new google.maps.Marker({
                map: map,
                position: centerLatLng,
                draggable: true
              });
              myMarker.addListener('dragend', function() {
                map.setCenter(myMarker.getPosition());
              });
            }
          }).catch(function(err) {
            console.log("googleMap.setCenterByCurrentPosition :::\n", err);
            Message.hide();
            Message.alert(
              '위치 공유가 꺼져있습니다.',
              '위치 공유를 켜주세요.'
            );
          });
        }

        // find address.


        //====================================================
        //  Link Function
        //====================================================
        return function link(scope, element, attrs) {
          // functions bind to CtrlAs method
          scope.vm.setCenterByAddress = setCenterByAddress;
          scope.vm.setCenterByCurrentPosition = setCenterByCurrentPosition;
          scope.vm.setCenterByPlace = setCenterByPlace;
          // on bindDataComplete add features to the map
          // if params.id exists remove all features and add only one back.
          scope.$on('$rootScope:bindDataComplete', function() {
            $timeout(function() {
              var geoJson = dataToFeatures(scope.places);
              if (geoJson.length === 0) {
                return false;
              }
              if ($state.params.id) {
                console.log("geoJson.features[0].geometry.coordinates[1] :::\n", geoJson.features[0].geometry.coordinates[1]);
                console.log("geoJson.features[0].geometry.coordinates[0] :::\n", geoJson.features[0].geometry.coordinates[0]);
                map.setCenter(new google.maps.LatLng(
                  (geoJson.features[0] && geoJson.features[0].geometry.coordinates[1] /*+ 0.00655043392 */ ),
                  (geoJson.features[0] && geoJson.features[0].geometry.coordinates[0] /*- 0.0081287461 */ )
                ));
                // map.setCenter(new google.maps.LatLng(
                //   Number(geoJson.features[0] && geoJson.features[0].geometry.coordinates[1]),
                //   Number(geoJson.features[0] && geoJson.features[0].geometry.coordinates[0])
                // ));
              }
              map.data.addGeoJson(geoJson);
            }, 5);
          });

          map.data.addListener('click', function(event) {
            scope.$emit('googleMap:featureClicked', event.feature.getProperty('id'));
            if (attrs.activeIcon) { /* set clicked feature's style */
              map.data.revertStyle();
              map.data.overrideStyle(event.feature, {
                icon: attrs.activeIcon,
              });
            }
          });

          scope.$on('relayout', function() {
            $timeout(function() {
              google.maps.event.trigger(map, 'resize');
            }, 0);
          });

          if (attrs.idleEvent === 'true') {
            if (!$state.params.id) {
              map.addListener('idle', function() {
                var lng = map.getCenter().lng();
                var lat = map.getCenter().lat();
                appStorage[attrs.id].lastCenter.lat = lat;
                appStorage[attrs.id].lastCenter.lng = lng;
                scope.$emit('googleMap:centerChanged', appStorage[attrs.id].lastCenter);
              });

            }
          }

        }; /*link ends*/
      } /*compile ends*/
    }; /* directive definition object ends */

    return directiveDefinitionObject;

    //====================================================
    //  Helper
    //====================================================
    //( placeArray: <Array>{geoJSON: {type: 'Point', coordinates: <Array>Number}} )
    //=> FeatureObjs: <Array> {
    //  type: String, 
    //  features: {
    //    type: String, 
    //    geometry: <Array>Number, 
    //    properties: Object
    //  }}
    function dataToFeatures(placeArray) {
      var result = {
        type: 'FeatureCollection',
        features: []
      };
      if (!Array.isArray(placeArray)) {
        placeArray = _.compact([placeArray]);
      }
      var features = _.map(placeArray, function(item) {
        var feature = {
          type: 'Feature'
        };
        if (item.geoJSON) {
          var geometry = _.clone(item.geoJSON);
          delete item.geoJSON;
          feature.properties = item;
          feature.geometry = geometry;
          return feature;
        }
      });
      result.features = _.compact(features);
      return result;
    }

  } // google map directive ends
})();
