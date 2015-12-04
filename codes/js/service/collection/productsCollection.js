(function() {
  'use strict';
  angular.module('app')
    .factory('Products', Products);

  Products.$inject = ['$resource', 'governorUrl', '$cordovaFileTransfer', '_', '$q', 'Upload', 'U'];

  function Products($resource, governorUrl, $cordovaFileTransfer, _, $q, Upload, U) {

    var productUrl = governorUrl + '/product' + '/:list' +
      '/:image' + '/:mine' + '/:checkProductCode' + '/:ids' + '/:comments' + '/:within' + '/:like' + '/:unlike' + '/:setSoldOut' + '/:unsetSoldOut';

    var params = {
      list: '@list',
      image: '@image',
      mine: '@mine',
      checkProductCode: '@checkProductCode',
      ids: '@ids',
      comments: '@comments',
      within: '@within',
      like: '@like',
      unlike: '@unlike',
      setSoldOut: '@setSoldOut',
      unsetSoldOut: '@unsetSoldOut'
    };

    var actions = {

      setSoldOut: {
        method: 'PUT',
        params: {
          setSoldOut: 'setSoldOut'
        }
      },

      unsetSoldOut: {
        method: 'PUT',
        params: {
          unsetSoldOut: 'unsetSoldOut'
        }
      },

      unlike: {
        method: 'PUT',
        params: {
          unlike: 'unlike'
        }
      },

      like: {
        method: 'PUT',
        params: {
          like: 'like'
        }
      },

      getProductWithin: { // longitude, latitude, distance
        method: 'GET',
        params: {
          list: 'list',
          within: 'within'
        }
      },

      getProductsWithComments: {
        method: 'GET',
        params: {
          comments: 'comments'
        },
        isArray: true
      },
      getProductsWithIds: {
        method: 'GET',
        params: {
          ids: 'ids'
        },
        isArray: true
      },
      getProducts: {
        method: 'GET',
        params: {
          list: 'list'
        }
      },
      getMyProducts: {
        method: 'GET',
        params: {
          list: 'list',
          mine: 'mine'
        }
      },
      checkProductCode: {
        method: 'GET',
        params: {
          checkProductCode: 'checkProductCode'
        }
      },
      findById: {
        method: 'GET'
      },
      createProduct: {
        method: 'POST'
      },
      updateProduct: {
        method: 'PUT'
      },
      removeProduct: {
        method: 'DELETE'
      },
      removeProducts: {
        method: 'DELETE',
        isArray: true
      }
    };

    var service = $resource(productUrl, params, actions);

    service.createProductWithImage = createProductWithImage;
    //------------------------
    //  CUSTOM NON-HTTP METHODS
    //------------------------
    function createProductWithImage(params, product) {

      angular.extend(product, params);

      // var fileUri = U.toArray(product.fileUri);
      var dataUri = U.toArray(product.dataUri);
      delete product.fileUri;
      delete product.dataUri;

      var filesToSend = [];
      console.log("---------- dataUri ----------");
      console.log(dataUri);
      console.log("HAS TYPE: " + typeof dataUri);
      console.log("---------- CONSOLE END -------------------");

      angular.forEach(dataUri, function(data) {
        filesToSend.push(U.imageDataToFile(data));
      });

      var promise = Upload.upload({
        url: governorUrl + '/product',
        file: filesToSend,
        method: 'POST',
        fields: product,
        sendFieldsAs: 'json',
        withCredentials: false,
        chunkedMode: false,
        headers: {
          Coonection: 'close'
        }
      });
      return {
        $promise: promise
      };
    } //end createProductWithImage

    return service;









    // service.createProductWithImage = function(params, data) {

    //   angular.extend(data, params);
    //   if (Array.isArray(data.file)) {

    //     var files = data.file;
    //     delete data.file;
    //     var promises = _.map(files, function(uri, i) {
    //       if (i === 0) {
    //         return fileUpload(uri, data);
    //       }
    //       return fileUpload(uri);
    //     });
    //     return {
    //       $promise: $q.all(promises)
    //     };

    //     // Post brand new post with AN image to server
    //     //wait for it to come back with postid
    //     // update post by sending photos.

    //   } else if (!Array.isArray(data.file)) {

    //     var file = data.file;
    //     delete data.file;
    //     var promise = fileUpload(file, data);

    //     return {
    //       $promise: $q.all([promise])
    //     };

    //   }
    // };

    //   service.updateProductWithImage = function(parameters, product) {
    //     angular.extend(product, parameters);
    //     var filePath = product.file;
    //     delete product.file;
    //     var options = {
    //       params: product,
    //       chunkedMode: false,
    //       httpMethod: 'PUT'
    //     };
    //     return {
    //       '$promise': $cordovaFileTransfer.upload(governorUrl + '/product', filePath, options)
    //     };

    //   };

    //   return service;


    //   // Helper function.
    //   // Upload a single file.
    //   function fileUpload(file, data) {
    //     var options = {
    //       chunkedMode: false
    //     };
    //     if (data) {
    //       options.params = data;
    //     }
    //     var promise = $cordovaFileTransfer.upload(governorUrl + '/product', file, options);
    //     return promise;
    //   }
  } //end
})();





// /* Set the default values for ngf-select and ngf-drop directives*/
// Upload.setDefaults({
//   ngfMinSize: 20000,
//   ngfMaxSize: 20000000,
// });

// /* Convert the file to base64 data url*/
// Upload.dataUrl(file, disallowObjectUrl).then(function(url) {});

// /* Get image file dimensions*/
// Upload.imageDimensions(file).then(function(dimensions) {
//   console.log(dimensions.width, dimensions.height);
// });

// /* Get audio/video duration*/
// Upload.mediaDuration(file).then(function(durationInSeconds) {

// });

// /* returns boolean showing if image resize is supported by this browser*/
// Upload.isResizeSupported();
// /* returns boolean showing if resumable upload is supported by this browser*/
// Upload.isResumeSupported();
