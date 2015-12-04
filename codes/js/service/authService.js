(function() {
  'use strict';

  //====================================================
  //  AuthInterceptor
  //====================================================
  angular.module('app')
    .factory('AuthInterceptor', AuthInterceptor);

  AuthInterceptor.$inject = ['appStorage'];

  function AuthInterceptor(appStorage) {

    return {
      request: requestInterceptor
    };

    function requestInterceptor(req) {
      var token = appStorage.token;
      if (token) {
        // req.headers['Content-Type'] = 'application/json';
        req.headers.Authorization = 'Bearer ' + token;
      }
      return req;

    }
  }


  //====================================================
  //  AuthService
  //====================================================
  angular.module('app')
    .service("AuthService", AuthService);

  AuthService.$inject = ['appStorage', '$http', '$q', '$location', '$state', 'governorUrl', 'LocalService', 'appName', 'kakaoKey', 'facebookKey', '$cordovaOauth', '$window'];

  function AuthService(appStorage, $http, $q, $location, $state, governorUrl, LocalService, appName, kakaoKey, facebookKey, $cordovaOauth, $window) {

    var service = {
      getToken: getToken,
      register: register,
      registerWithImage: registerWithImage,
      login: login,
      verifyResetCode: verifyResetCode,
      passReset: passReset,
      logout: logout,
      changePassword: changePassword,
      checkNickname: checkNickname,
      checkEmail: checkEmail,
      getMyProfile: getMyProfile,
      updateMyProfile: updateMyProfile,
      updateMyProfileWithImage: updateMyProfileWithImage,
      // loginWithKakao: loginWithKakao,
      loginWithFacebook: loginWithFacebook
    };

    return service;

    function getToken() {
      var token = appStorage.token;
      if (token) {
        return token;
      } else {
        $state.go('main.login');
      }
    }

    function register(user) {
      var deferred = $q.defer();
      $http({
        url: governorUrl + '/user/register',
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        params: user
      })
        .success(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function registerWithImage(user, file, success, fail) {
      var options = new FileUploadOptions();
      var newUser = angular.copy(user);
      options.params = newUser;
      options.headers = {
        Connection: "close"
      };
      options.chunkedMode = false;
      var ft = new FileTransfer();
      ft.upload(file, encodeURI(governorUrl + '/user/registerWithImage'), success, fail, options, true);
    }

    function login(email, password) {
      var deferred = $q.defer();
      $http({
        url: governorUrl + '/auth/local',
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'identifier': email,
          'password': password
        }
      })
        .success(function(data, status, headers, config) {
          console.log(status, headers, config);
          appStorage.token = data.token;
          appStorage.user = data.user;
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function verifyResetCode(email, code) {
      var deferred = $q.defer();
      $http({
        url: governorUrl + '/user/passwordresetcomplete',
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'email': email,
          'code': code
        }
      })
        .success(function(data, status, headers, config) {
          console.log(status, headers, config);
          appStorage.user = data.user;
          appStorage.token = data.token;
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function passReset(email) {
      var deferred = $q.defer();
      $http({
        url: governorUrl + '/user/resetStart',
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'email': email
        }
      })
        .success(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function logout() {
      appStorage.user = null;
      appStorage.token = null;
    }

    function changePassword(oldPassword, newPassword) {
      var deferred = $q.defer();
      $http({
        url: governorUrl + '/user/changePassword',
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          'oldPassword': oldPassword,
          'newPassword': newPassword
        }
      })
        .success(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function checkNickname(nickname) {
      var deferred = $q.defer();
      $http({
        url: governorUrl + '/user/checknickname',
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          nickname: nickname
        }
      })
        .success(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function checkEmail(email) {
      var deferred = $q.defer();
      $http({
        url: governorUrl + '/user/checkEmail',
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          email: email
        }
      })
        .success(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function getMyProfile() {
      var deferred = $q.defer();
      $http({
        url: governorUrl + '/user/profile',
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .success(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function updateMyProfile(nickname) {
      var deferred = $q.defer();
      $http({
        url: governorUrl + '/user/update',
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          nickname: nickname
        }
      })
        .success(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.resolve(data);
        })
        .error(function(data, status, headers, config) {
          console.log(status, headers, config);
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function updateMyProfileWithImage(user, file, success, fail) {
      var options = new FileUploadOptions();
      var updateUser = angular.copy(user);
      options.params = updateUser;
      options.httpMethod = 'PUT';
      options.headers = {
        Connection: "close",
        Authorization: 'Bearer ' + appStorage.token
      };
      options.chunkedMode = false;
      var ft = new FileTransfer();
      ft.upload(file, encodeURI(governorUrl + '/user/updateWithImage'), success, fail, options, true);
    }

    // function loginWithKakao() {
    //   var deferred = $q.defer();
    //   if ($window.cordova && $window.cordova.plugins.KakaoLogin) {
    //     $window.cordova.plugins.KakaoLogin.login('login', function(data) {
    //       var result = {};
    //       result.provider = 'kakao';
    //       result.access_token = data;
    //       registerLogin(result);
    //     }, function(error) {
    //       console.log(error);
    //       $cordovaOauth.kakao(kakaoKey).then(function(result) {
    //         result.provider = 'kakao';
    //         registerLogin(result);
    //       }, function(error) {
    //         deferred.reject(error);
    //       });
    //     });
    //   }

    //   function registerLogin(result) {
    //     $http({
    //       url: governorUrl + '/auth/register',
    //       method: 'post',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       data: result
    //     })
    //       .success(function(data, status, headers, config) {
    //         console.log(status, headers, config);
    //         appStorage.user = data.user;
    //         appStorage.token = data.token;
    //         deferred.resolve(data);
    //       })
    //       .error(function(data, status, headers, config) {
    //         console.log(data, status, headers, config);
    //         deferred.reject(data);
    //       });
    //   }
    //   return deferred.promise;
    // }

    function loginWithFacebook() {
      var deferred = $q.defer();
      $cordovaOauth.facebook(facebookKey, ["email"]).then(function(result) {
        result.provider = 'facebook';
        console.log('facebook server result');
        console.log(result);
        $http({
          url: governorUrl + '/auth/register',
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          data: result
        })
          .success(function(data, status, headers, config) {
            console.log(status, headers, config);
            appStorage.user = data.user;
            appStorage.user.profile_picture = data.user.profile_image;
            appStorage.token = data.token;
            deferred.resolve(data);
          })
          .error(function(data, status, headers, config) {
            console.log(data, status, headers, config);
            deferred.reject(data);
          });
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    }
  }
})();
