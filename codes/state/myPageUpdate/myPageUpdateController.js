(function() {
  'use strict';
  angular.module('app')
    .controller('MyPageUpdateController', MyPageUpdateController);

  MyPageUpdateController.$inject = [
    '$stateParams', '$ionicScrollDelegate', '$timeout', '$scope', '$state', '$q',
    'MyPageUpdateModel', 'Message', 'ImageService', 'appStorage', 'Users', 'Ua'
  ];

  function MyPageUpdateController(
    $stateParams, $ionicScrollDelegate, $timeout, $scope, $state, $q,
    MyPageUpdateModel, Message, ImageService, appStorage, Users, Ua
  ) {

    var PostRegister = this;
    PostRegister.Model = MyPageUpdateModel;

    $scope.$on('$ionicView.afterEnter', onAfterEnter);

    PostRegister.getImage = getImage;
    PostRegister.updateMyPage = updateMyPage;

    //====================================================
    //  View Events
    //====================================================

    function onAfterEnter() {
      return init()
        .then(function(user) {
          return Ua.bindData(user, MyPageUpdateModel, 'user');
        })
        .catch(function(err) {
          return Ua.error(err);
        });
    }

    function getImage(from) {
      MyPageUpdateModel.imageDataArray = [];
      MyPageUpdateModel.imageFileArray = [];
      ImageService.clean();
      return ImageService.get({
        from: from,
        fileUris: MyPageUpdateModel.imageFileArray,
        dataUris: MyPageUpdateModel.imageDataArray
      });
    }

    function updateMyPage() {
      Message.loading();
      return myPageUpdate()
        .then(function() {
          return Message.alert('상점 변경알림', '상점이 성공적으로 변경되었습니다.');
        })
        .then(function() {
          reset();
          $state.go('main.myPage', {
            user: appStorage.user.id
          });
        })
        .catch(function(err) {
          Message.hide();
          Message.alert('상점 변경 알림', '로그인 유저만 사점을 변경할수 있습니다.');
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
      return userFindOne();
    }

    function reset() {
      MyPageUpdateModel.imageFileArray = [];
      MyPageUpdateModel.imageDataArray = [];
      ImageService.clean();
    }

    //====================================================
    //  REST
    //====================================================
    function userFindOne(extraQuery) {
      var queryWrapper = {
        id: appStorage.user.id,

        populates: 'bgPhoto'
      };
      angular.extend(queryWrapper, extraQuery);
      return Users.findOne(queryWrapper).$promise
        .then(function(user) {
          return user; // { bgPhoto: {url:'http'}, summary: '안녕?'}
        });
    }

    function myPageUpdate() {
      return ImageService.post({
        url: '/user/updateMyPage',
        dataUris: MyPageUpdateModel.imageDataArray,
        fields: {
          title: MyPageUpdateModel.user.title,
          content: MyPageUpdateModel.user.content
        }
      }, 'POST');
    }

  } //end
})();
