(function() {
  'use strict';

  angular.module('app')
    .factory('U', U);

  U.$inject = ['$window'];

  function U($window) {

    var service = {
      toArray: toArray,
      imageDataToFile: imageDataToFile
    };

    return service;

    //====================================================
    //  IMPLEMENTATIONS
    //====================================================
    function toArray(obj) {
      var array = [];
      if (!Array.isArray(obj)) {
        array = [obj];
      } else if (Array.isArray(obj)) {
        array = obj;
      }
      return array;
    }

    function imageDataToFile(imageData) {
      var blob = dataURItoBlob(imageData);
      return blob;
    }

    //====================================================
    //  Helper
    //====================================================
    function dataURItoBlob(dataURI) {
      var byteString;
      var mimestring;

      if (dataURI.split(',')[0].indexOf('base64') !== -1) {
        byteString = $window.atob(dataURI.split(',')[1]);
      } else {
        byteString = $window.decodeURI(dataURI.split(',')[1]);
      }

      mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

      var content = [];
      for (var i = 0; i < byteString.length; i++) {
        content[i] = byteString.charCodeAt(i);
      }

      return new $window.Blob([new $window.Uint8Array(content)], {
        type: mimestring
      });
    }
  } // end
})();
