(function() {
  'use strict';
  angular.module('app')
    .controller('SavedController', SavedController);

  SavedController.$inject = ['SavedModel', 'Products', 'appStorage', '$scope', '$stateParams'];

  function SavedController(SavedModel, Products, appStorage, $scope, $stateParams) {

    var Saved = this;
    Saved.Model = SavedModel;
    Saved.dynamicStyle = dynamicStyle;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function dynamicStyle(post) {
      var result = {};
      if (post && post.isAds) {
        result.height = '120';
        result.width = '99%';
      } else {
        result.height = '160';
        result.width = '33%';
      }
      return result;
    }

    function onBeforeEnter() {
      reset();
      if ($stateParams.by === 'favorited') {
        getProductsWithIds(appStorage.favorite);
      } else if ($stateParams.by === 'commented') {
        getProductsWithComments();
      }
    }

    //====================================================
    //  Helper
    //====================================================
    function reset() {
      SavedModel.posts = [];
    }

    function getProductsWithIds(ids) {
      console.log(Array.isArray(ids));
      Products.getProductsWithIds({
        id: ids
      }).$promise
        .then(function success(products) {
          SavedModel.posts = products;
          console.log(products);
        })
        .catch(function error(err) {
          console.log(err);
        });
    }

    function getProductsWithComments() {
      Products.getProductsWithComments({
        //username from httpInterceptor is used
      }).$promise
        .then(function success(products) {
          SavedModel.posts = products;
          console.log(products);
        })
        .catch(function error(err) {
          console.log(err);
        });

    }
  }
})();
