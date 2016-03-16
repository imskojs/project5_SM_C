(function() {
  'use strict';
  angular.module('app')
    .controller('MyPageController', MyPageController);

  MyPageController.$inject = [
    '$scope', '$timeout', '$stateParams', '$ionicScrollDelegate', '$q', '$state',
    '$window',
    'Products', 'MyPageModel', 'Message', 'ImageService', 'Users', 'Ua'
  ];

  function MyPageController(
    $scope, $timeout, $stateParams, $ionicScrollDelegate, $q, $state,
    $window,
    Products, MyPageModel, Message, ImageService, Users, Ua
  ) {
    // var _ = $window._;
    var MyPage = this;
    MyPage.Model = MyPageModel;

    $scope.$on('$ionicView.afterEnter', onAfterEnter);
    $scope.$on('$ionicView.afterLeave', onAfterLeave);

    MyPage.getMoreProducts = getMoreProducts;
    MyPage.showAlert = showAlert;
    MyPage.crupdateBgPhoto = crupdateBgPhoto;
    MyPage.checkForMore = checkForMore;

    //====================================================
    //  View Enter
    //====================================================
    function onAfterEnter() {
      return init()
        .then(function(array) {
          var productsWrapper = array[0];
          var user = array[1];
          var hostUser = array[2];
          Ua.bindData(productsWrapper, MyPageModel, 'products', false, false, true);
          Ua.bindData(user, MyPageModel, 'user', false, false, true);
          Ua.bindData(hostUser, MyPageModel, 'hostUser');
        })
        .catch(function(err) {
          console.log("err :::\n", err);
        });
    }

    function onAfterLeave() {
      return reset();
    }

    //====================================================
    //  Implementations
    //====================================================
    function getMoreProducts() {
      return productGet({
          skip: MyPageModel.products.length
        })
        .then(function(productsWrapper) {
          console.log("productsWrapper :::\n", productsWrapper);
          Ua.appendData(productsWrapper, MyPageModel, 'products');
        })
        .catch(function error(err) {
          Ua.error(err);
          console.log("err :::\n", err);
        });
      // .finally(function() {
      //   Ua.broadcast($scope);
      // });
    }

    function showAlert() {
      Message.alert('sold out 알림', '이미 팔린 물품입니다.');
    }

    function crupdateBgPhoto() {
      MyPageModel.imageFileArray = [];
      MyPageModel.imageDataArray = [];
      return ImageService.get({
          from: 'gallery', // gallery, camera
          fileUris: MyPageModel.imageFileArray,
          dataUris: MyPageModel.imageDataArray
        })
        .then(function() {
          return photoPost();
        })
        .then(function(user) {
          $timeout(function() {
            MyPageModel.user = user;
          }, 0);
        });
    }

    function checkForMore() {
      return MyPageModel.more;
    }


    //====================================================
    //  Helper
    //====================================================
    function init() {
      return $q.all([productGet(), userFindOne(), userVisit()]);
    }

    function reset() {
      MyPageModel.products = [];
      MyPageModel.user = {};
    }

    //====================================================
    //  REST
    //====================================================
    function productGet(extraQuery) {
      var queryWrapper = {
        createdBy: $state.params.user,
        sort: 'id DESC',

        // isAds: false,
        limit: 24,
        populates: 'photos'
      };
      angular.extend(queryWrapper, extraQuery);
      return Products.getProducts(queryWrapper).$promise
        .then(function(productsWrapper) {
          console.log("productsWrapper :::\n", productsWrapper);
          return productsWrapper;
        });
    }

    function userFindOne(extraQuery) {
      var queryWrapper = {
        id: $state.params.user,
        populates: 'bgPhoto'
      };
      angular.extend(queryWrapper, extraQuery);
      return Users.findOne(queryWrapper).$promise
        .then(function(user) {
          return user; // { bgPhoto: {url:'http'}, title: '안녕?', content: '내 상점이야'}
        });
    }

    function photoPost() {
      return ImageService.post({
          url: '/user/updateMyPage',
          dataUris: MyPageModel.imageDataArray,
          fields: MyPageModel.form
        }, 'POST')
        .then(function(dataWrapper) {
          var updatedUser = dataWrapper.data;
          return updatedUser;
        });
    }

    function userVisit(extraQuery) {
      var queryWrapper = {
        id: $state.params.user,
      };
      angular.extend(queryWrapper, extraQuery);
      return Users.visit(queryWrapper).$promise
        .then(function(hostUser) {
          return hostUser;
        });
    }

  } // END;
})();
