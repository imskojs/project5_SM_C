(function() {
  'use strict';
  angular.module('app')
    .controller('ProfileController', ProfileController);

  ProfileController.$inject = ['ProfileModel', 'appStorage', 'ImageService', 'Message', '$rootScope', '$state', 'Users', '$scope'];

  function ProfileController(ProfileModel, appStorage, ImageService, Message, $rootScope, $state, Users, $scope) {

    var Profile = this;
    Profile.Model = ProfileModel;

    Profile.update = update;
    Profile.getPicture = getPicture;
    Profile.goBack = goBack;

    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);
    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function update() {
      Message.loading();
      if (!ProfileModel.form.phone) delete ProfileModel.form.phone;
      if (!ProfileModel.form.nickname) delete ProfileModel.form.nickname;
      // If no picture update
      if (ProfileModel.dataArray.length === 0) {
        return Users.updateUser({}, ProfileModel.form).$promise
          .then(function success(userArray) {
            var user = userArray[0];
            setAppStorageValues(user);
            Message.hide();
            return Message.alert('프로필 업데이트 알림', '업데이트가 성공적으로 되었습니다');
          })
          .then(function response() {
            $state.go('main.home');
          })
          .catch(function error(err) {
            Message.hide();
            console.log(err);
          });
      } else if (ProfileModel.dataArray.length > 0) {
        ImageService.post({
          url: '/user/updateWithImage',
          dataUris: ProfileModel.dataArray,
          fields: ProfileModel.form
        }, 'PUT')
          .then(function profileUpdateSuccess(dataWrapper) {
            var user = dataWrapper.data;
            setAppStorageValues(user);
            return Message.alert('프로필 업데이트 알림', '업데이트가 성공적으로 되었습니다');
          })
          .then(function response() {
            $state.go('main.home');
          })
          .catch(function error(err) {
            Message.hide();
            console.log(err);
            Message.alert('프로필 업데이트 알림', '업데이트가 실패하였습니다, 나중에 다시 해주세요.');
          });
      }
    } // update ends

    function getPicture(from) {
      if (ProfileModel.fileArray.length > 0 || ProfileModel.dataArray.length > 0) {
        return Message.alert('사진 고르기 알림', '이미 사진을 고르셨습니다.');
      }
      return ImageService.get({
        from: from,
        fileUris: ProfileModel.fileArray,
        dataUris: ProfileModel.dataArray
      });
    }

    function onBeforeEnter() {
      var form = ProfileModel.form;
      form.nickname = appStorage.user.nickname;
      form.phone = Number(appStorage.user.phone);
    }
    //====================================================
    //  Helper
    //====================================================
    function setAppStorageValues(user) {
      appStorage.user.profile_picture = user.profile_picture && user.profile_picture.url || user.profile_image;
      appStorage.user.nickname = user.nickname;
      appStorage.user.phone = user.phone;
    }

    function reset() {
      ProfileModel.form = {
        profile_picture: null,
        nickname: null
      };
      ProfileModel.fileArray = [];
      ProfileModel.dataArray = [];
    }

    function goBack() {
      reset();
      return $rootScope.goBack();
    }
  }
})();
