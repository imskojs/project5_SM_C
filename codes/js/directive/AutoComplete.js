// (function() {
//   'use strict';

//   angular.module('app')
//     .directive('autoComplete', autoComplete);

//   autoComplete.$inject = [
//     '$window', '$timeout', '$state', '$cordovaGeolocation',
//     'Message', 'appStorage'
//   ];

//   function autoComplete(
//     $window, $timeout, $state, $cordovaGeolocation,
//     Message, appStorage
//   ) {
//     var _ = $window._;

//     var directiveDefinitionObject = {
//       scope: {
//         vm: '=',
//         places: '='
//       },
//       compile: function(element, attrs) {
//         var google = $window.google;
//         //====================================================
//         //  Initial Setup
//         //====================================================
//         var input = element[0];
//         var autocomplete = new google.maps.places.Autocomplete(input);




//         //====================================================
//         //  Link Function
//         //====================================================
//         return function link(scope, element, attrs) {

//         }; /*link ends*/
//       } /*compile ends*/
//     }; /* directive definition object ends */

//     return directiveDefinitionObject;

//     //====================================================
//     //  Helper
//     //====================================================

//   } // google map directive ends
// })();
