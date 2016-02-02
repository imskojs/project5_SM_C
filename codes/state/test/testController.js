(function() {
  'use strict';
  angular.module('app')
    .controller('TestController', TestController);

  TestController.$inject = [
    '$rootScope', '$scope', '$q', '$window',
    'TestModel', 'Products', 'Message'
  ];

  function TestController(
    $rootScope, $scope, $q, $window,
    TestModel, Products, Message
  ) {
    var Test = this;
    Test.Model = TestModel;

    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    $scope.$on('googleMap:featureClicked', onFeatureClicked);
    $scope.$on('googleMap:centerChanged', onCenterChanged);

    Test.setCenterByAdress = null; /*set by google-map directive*/

    //====================================================
    //  View Events
    //====================================================
    function onAfterEnter() {
      return productGetProductWithin();
    }

    function onFeatureClicked(event, id) {
      console.log("id :::\n", id);
    }

    function onCenterChanged(event, latLngObj) {
      console.log("latLngObj :::\n", latLngObj);
    }

    //====================================================
    //  Implementation
    //====================================================


    //====================================================
    //  REST
    //====================================================
    function productGetProductWithin() {
      return Products.getProductWithin({
          type: 'local',
          latitude: 37.497942,
          longitude: 127.027621,
          distance: 15000,
          limit: 50
        }).$promise
        .then(function(datasWrapper) {
          TestModel.products = datasWrapper.products;
          console.log("TestModel.products :::\n", TestModel.products);
          $rootScope.$broadcast('$rootScope:bindDataComplete');

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
      }).$promise.then(function(data) {
        Message.hide();
        TestModel.selectedPlace = data;
        console.log("TestModel.selectedPlace :::\n", TestModel.selectedPlace);
      }).catch(function(err) {
        Message.hide();
        Message.alert();
        console.log("err :::\n", err);
      });

    }
  }
})();
