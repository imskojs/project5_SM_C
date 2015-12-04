(function() {
  'use strict';
  angular.module('app')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['LoginModel', 'Users', 'appStorage', '$state', 'AuthService', 'Message'];

  function LoginController(LoginModel, Users, appStorage, $state, AuthService, Message) {

    var Login = this;
    Login.Model = LoginModel;

    Login.loginHandler = loginHandler;
    Login.loginWithFacebook = loginWithFacebook;

    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function loginHandler() {
      Message.loading();
      Users.login({}, {
        identifier: LoginModel.form.email,
        password: LoginModel.form.password
      }).$promise
        .then(function success(authData) {
          appStorage.token = authData.token;
          appStorage.user = authData.user;
          Message.hide();
          $state.go('main.home');
        })
        .catch(function err(error) {
          console.log(error);
          Message.hide();
          Message.alert('로그인 알림', '이메일이나 암호가 잘못 되었습니다.')
            .then(function() {
              LoginModel.form = {};
            });
        });
    }

    function loginWithFacebook() {
      Message.loading();
      return AuthService.loginWithFacebook()
        .then(function success(data) {
          console.log(data);
          Message.hide();
          $state.go('main.home');
        }, function err(error) {
          console.log(error);
        });
    }

  }
})();
