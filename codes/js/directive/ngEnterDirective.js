//====================================================
//  createdBy;
// Seunghoon Ko (imskojs@gmail.com)
//====================================================
// Calls a specified function when enter is pressed on input
// Usage
// <input ng-enter="vm.myFunction()"></input>
(function(angular) {
  'use strict';
  angular.module('app')
    .directive('ngEnter', ngEnter);

  ngEnter.$inject = ['$window'];

  function ngEnter($window) {
    return function(scope, element, attrs) {
      element.bind("keydown keypress", function(event) {
        if (event.which === 13) {
          scope.$apply(function() {
            scope.$eval(attrs.ngEnter);
          });
          if ($window.cordova) {
            $window.cordova.plugins.Keyboard.close();
          }
          event.preventDefault();
        }
      });
    };
  }
})(angular);
