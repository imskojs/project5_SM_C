//====================================================
//  createdBy;
// Seunghoon Ko (imskojs@gmail.com)
//====================================================
// Calls a specified function when enter is pressed on input
// Usage
// <input ng-enter="vm.myFunction()"></input>
(function() {
  'use strict';
  angular.module('app')
    .directive('ngEnter', function() {

      return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
          if (event.which === 13) {
            scope.$apply(function() {
              scope.$eval(attrs.ngEnter);
            });

            event.preventDefault();
          }
        });
      };
    });
})();
