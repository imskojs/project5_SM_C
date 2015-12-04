(function() {
  'use strict';

  angular.module('app')
    .factory('SignupModel', SignupModel);

  SignupModel.$inject = [];

  function SignupModel() {

    var model = {
      form: {
        email: null,
        password: null,
      },
      agree: false,
      private: false
    };
    return model;
  }
})();
