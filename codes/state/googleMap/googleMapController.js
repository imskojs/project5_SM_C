(function() {
  'use strict';
  angular.module('app')
    .controller('GoogleMapController', GoogleMapController);

  GoogleMapController.$inject = [
    '$rootScope', '$scope', '$q', '$window', '$ionicModal', '$state',
    'GoogleMapModel', 'Products', 'Message', 'appStorage'
  ];

  function GoogleMapController(
    $rootScope, $scope, $q, $window, $ionicModal, $state,
    GoogleMapModel, Products, Message, appStorage
  ) {
    var GoogleMap = this;
    GoogleMap.Model = GoogleMapModel;

    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    $scope.$on('googleMap:featureClicked', onFeatureClicked);
    $scope.$on('googleMap:centerChanged', onCenterChanged);

    // set by google-map directive
    GoogleMap.setCenterByAdress = null;
    GoogleMap.setCenterByCurrentPosition = null;

    GoogleMap.goToDetailHandler = goToDetailHandler;
    //====================================================
    //  View Events
    //====================================================
    function onAfterEnter() {
      if ($state.params.id) {
        Message.loading();
        return Products.findById({
            id: $state.params.id,
            populates: 'photos,createdBy'
          }).$promise
          .then(function(data) {
            Message.hide();
            GoogleMapModel.selectedPlace = data;
            GoogleMapModel.places = [data];
            $scope.$broadcast('relayout');
            console.log("GoogleMapModel.selectedPlace :::\n", GoogleMapModel.selectedPlace);
          })
          .catch(function(err) {
            Message.hide();
            Message.alert();
            console.log("err :::\n", err);
          });
      } else {
        return productGetProductWithin();
      }
    }

    function onFeatureClicked(event, id) {
      console.log("id :::\n", id);
      return productFindById(id);
    }

    function onCenterChanged(event, latLngObj) {
      console.log("latLngObj :::\n", latLngObj);
    }

    //====================================================
    //  Implementation
    //====================================================
    function goToDetailHandler(state, params) {
      Message.loading();
      GoogleMapModel.modal.hide();
      $state.go(state, {
        type: 'local',
        id: GoogleMapModel.selectedPlace.id,
        prev: params.prev
      });

    }

    //====================================================
    //  Modal
    //====================================================
    $ionicModal.fromTemplateUrl('state/googleMap/placeModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      GoogleMapModel.modal = modal;
    });

    //====================================================
    //  REST
    //====================================================
    function productGetProductWithin() {
      return Products.getProductWithin({
          type: 'local',
          latitude: appStorage.gm0.lastCenter.lat,
          longitude: appStorage.gm0.lastCenter.lng,
          distance: 9999999,
          limit: 9999999
        }).$promise
        .then(function(datasWrapper) {
          GoogleMapModel.products = datasWrapper.products;
          $rootScope.$broadcast('$rootScope:bindDataComplete');
          $scope.$broadcast('relayout');

        })
        .catch(function(err) {
          console.log("err :::\n", err);
        });
    }

    function productFindById(id) {
      Message.loading();
      return Products.findById({
          id: id,
          populates: 'photos,createdBy'
        }).$promise
        .then(function(data) {
          Message.hide();
          GoogleMapModel.selectedPlace = data;
          GoogleMapModel.places = [data];
          console.log("GoogleMapModel.selectedPlace :::\n", GoogleMapModel.selectedPlace);
          GoogleMapModel.modal.show();
        })
        .catch(function(err) {
          Message.hide();
          Message.alert();
          console.log("err :::\n", err);
        });

    }
  }
})();
