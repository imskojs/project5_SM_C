(function() {
  'use strict';
  angular.module('app')
    .controller('NearestListController', NearestListController);

  NearestListController.$inject = [
    '$scope',
    'NearestListModel', 'Products', 'appStorage', 'Ua'
  ];

  function NearestListController(
    $scope,
    NearestListModel, Products, appStorage, Ua
  ) {
    var NearestList = this;
    NearestList.Model = NearestListModel;

    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    //====================================================
    //  View Enter
    //====================================================
    function onAfterEnter() {
      return init()
        .then(function(productsWrapper) {
          console.log("productsWrapper :::\n", productsWrapper);
          return Ua.bindData(productsWrapper, NearestListModel, 'products');
        })
        .catch(function(err) {
          console.log("err :::\n", err);
        });
    }

    //====================================================
    //  Implementation
    //====================================================


    //====================================================
    //  Helper
    //====================================================
    function init() {
      return productGetProductWithin();
    }


    //====================================================
    //  REST
    //====================================================
    function productGetProductWithin(extraQuery) {
      var queryWrapper = {
        type: 'abroad',
        latitude: Number(appStorage.gm0.lastCenter.lat),
        longitude: Number(appStorage.gm0.lastCenter.lng),
        distance: 10000000000,
        limit: 200,
        populates: 'photos,createdBy'
      };
      angular.extend(queryWrapper, extraQuery);
      return Products.getProductWithin(queryWrapper).$promise
        .then(function(productsWrapper) {
          return productsWrapper;
        });
    }

  }
})();
