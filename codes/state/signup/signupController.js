(function() {
  'use strict';
  angular.module('app')
    .controller('SignupController', SignupController);

  SignupController.$inject = ['SignupModel', 'Message', 'Users', '$state'];

  function SignupController(SignupModel, Message, Users, $state) {

    var Signup = this;
    Signup.Model = SignupModel;

    Signup.handleSignup = handleSignup;
    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    function handleSignup() {
      console.log(SignupModel.form.password, SignupModel.passwordConfirm);
      if (SignupModel.form.password !== SignupModel.passwordConfirm) {
        return Message.alert('비밀번호 알림', '비밀번호를 다시 한번 확인해주시고 입력해주세요');
      }
      Users.register({}, SignupModel.form).$promise
        .then(function success(data) {
          console.log(data);
          Message.alert('회원가입 성공', '회원가입을 성공하였습니다.')
            .then(function() {
              reset();
              $state.go('main.login');
            });
        }, function error(err) {
          console.log(err);
          Message.hide();
          Message.alert('가입실패', '다시 입력해주세요')
            .then(function() {
              reset();
            });
        });
    }

    //====================================================
    //  Help
    //====================================================
    function reset() {
      var resetObj = {
        email: null,
        password: null
      };
      angular.copy(resetObj, SignupModel.form);
    }
  } // end factory function
})();
