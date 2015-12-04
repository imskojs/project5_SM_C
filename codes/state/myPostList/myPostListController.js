(function() {
  'use strict';
  angular.module('app')
    .controller('MyPostListController', MyPostListController);

  MyPostListController.$inject = ['Products', 'MyPostListModel', '$state', '$stateParams', '$timeout', 'Message', '$scope'];

  function MyPostListController(Products, MyPostListModel, $state, $stateParams, $timeout, Message, $scope) {

    var MyPostList = this;
    MyPostList.Model = MyPostListModel;
    MyPostList.dynamicStyle = dynamicStyle;

    MyPostList.select = select;

    MyPostList.update = update;
    MyPostList.setSoldOut = setSoldOut;
    MyPostList.cancelSoldOut = cancelSoldOut;

    MyPostList.destroy = destroy;

    MyPostList.toggleUpdate = toggleUpdate;
    MyPostList.toggleSetSoldOut = toggleSetSoldOut;
    MyPostList.toggleDestroy = toggleDestroy;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function onBeforeEnter() {
      Message.loading();
      Products.getMyProducts({
        type: $stateParams.type,
        populates: 'photos'
      }).$promise
        .then(function success(productsWrapper) {
          MyPostListModel.posts = productsWrapper.products;
          Message.hide();
        })
        .catch(function error(err) {
          Message.hide();
          Message.alert();
          console.log(err);
        });
    }

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

    function select(postId) {
      togglePop(MyPostListModel.selectedPosts, postId);
    }

    function update() {
      if (MyPostListModel.selectedPosts.length === 0) {
        return Message.alert('수정하기 알림', '수정하실 상품을 먼저 골라주세요')
          .then(function() {});
      } else if (MyPostListModel.selectedPosts.length > 1) {
        return Message.alert('수정하기 알림', '수정하실 상품을 1개만 골라주세요')
          .then(function() {
            MyPostListModel.selectedPosts = [];
          });
      } else if (MyPostListModel.selectedPosts.length === 1) {
        $state.go('main.postRegister', {
          type: $stateParams.type,
          id: MyPostListModel.selectedPosts[0],
          method: 'update'
        });
      }
      MyPostListModel.selectedPosts = [];
    }

    function setSoldOut() {
      if (MyPostListModel.selectedPosts.length === 0) {
        return Message.alert('Sold Out 알림', 'Sold Out 하실 상품들을 먼저 골라주세요');
      }
      Message.loading();
      var productIds = MyPostListModel.selectedPosts;
      Products.setSoldOut({
        id: productIds
      }).$promise
        .then(function success(data) {
          $state.reload();
          Message.hide();
          console.log(data);
        })
        .catch(function error(err) {
          Message.hide();
          console.log(err);
        });
    }

    function cancelSoldOut(postId) {
      Message.loading();
      Products.unsetSoldOut({
        id: postId
      }).$promise
        .then(function success(data) {
          $state.reload();
          Message.hide();
          console.log(data);
        })
        .catch(function error(err) {
          Message.hide();
          console.log(err);
        });
    }

    function destroy() {
      if (MyPostListModel.selectedPosts.length === 0) {
        return Message.alert('삭제하기 알림', '삭제하기 하실 상품들을 먼저 골라주세요');
      }
      Message.loading();
      Products.removeProducts({
        id: MyPostListModel.selectedPosts
      }).$promise
        .then(function processDeletedPosts(postsArray) {
          console.log(postsArray);
          MyPostListModel.selectedPosts = [];
          $state.reload();
          Message.hide();
        })
        .catch(function handleError(err) {
          MyPostListModel.selectedPosts = [];
          console.log(err);
          Message.hide();
        });
    }

    function toggleUpdate() {
      MyPostListModel.status = 'update';
    }

    function toggleSetSoldOut() {
      MyPostListModel.status = 'soldOut';
    }

    function toggleDestroy() {
      MyPostListModel.status = 'destroy';
      MyPostListModel.postsToDestroy = [];
    }

    //====================================================
    //  Helper
    //====================================================
    function togglePop(array, id) {
      if (array.indexOf(id) !== -1) {
        array.splice(array.indexOf(id), 1);
      } else {
        array.push(id);
      }
    }

  } // end
})();
