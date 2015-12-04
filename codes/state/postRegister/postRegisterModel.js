(function() {
  'use strict';

  angular.module('app')
    .factory('PostRegisterModel', PostRegisterModel);

  PostRegisterModel.$inject = [];

  function PostRegisterModel() {

    var model = {
      form: {
        // showPhone: true,
        // category: "maleCloth",
        // description: "11",
        // address: "11111",
        // name: "1",
        // price: 1111,
        // school: "111",
        // type: 'local | abroad',
        // geoJSON: {
        //   type: 'Point',
        //   coordinates: [130, 50]
        // },
        // createdBy: {},
        // createdAt: {}
      },
      places: [],
      imageFileArray: [],
      imageDataArray: []
    };
    return model;
  }
})();
