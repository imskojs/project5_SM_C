(function() {
  'use strict';
  angular.module('app')
    .controller('PostRegisterController', PostRegisterController);

  PostRegisterController.$inject = ['PostRegisterModel', 'MainModel', '$stateParams', 'Message', 'ImageService', 'Products', 'daum', '$ionicScrollDelegate', '$timeout', '$scope', '$state', 'appStorage', 'Schools', '_', '$q'];

  function PostRegisterController(PostRegisterModel, MainModel, $stateParams, Message, ImageService, Products, daum, $ionicScrollDelegate, $timeout, $scope, $state, appStorage,
    Schools, _, $q
  ) {

    var PostRegister = this;
    PostRegister.Model = PostRegisterModel;
    PostRegisterModel.form.photos = [];
    // needed for selecting category;
    PostRegister.categoryList = MainModel.categoryList;
    PostRegister.toggleShowPhone = toggleShowPhone;
    PostRegister.create = create;
    PostRegister.update = update;
    PostRegister.reset = reset;
    PostRegister.getImage = getImage;
    PostRegister.searchPlace = searchPlace;
    PostRegister.selectPlace = selectPlace;
    PostRegister.getPhoto = getPhoto;
    PostRegister.removePhoto = removePhoto;
    PostRegister.showCircle = showCircle;
    // PostRegister.schools = Schools;
    PostRegister.getSchools = getSchools;

    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
    $scope.$on('$ionicView.beforeEnter', onBeforeEnter);

    function onBeforeEnter() {
      if ($stateParams.method === 'update') {
        PostRegisterModel.form.photos = [];
        return Products
          .findById({
            id: $stateParams.id,
            populates: 'photos'
          }).$promise
          .then(function success(product) {
            console.log(product);
            var form = PostRegisterModel.form;
            form.category = product.category;
            form.name = product.name;
            form.description = product.description;
            form.price = Number(product.price);
            form.address = product.address;
            form.geoJSON = product.geoJSON;
            form.showPhone = product.showPhone;
            form.id = $stateParams.id;
            var tags = product.school.split(', ');
            PostRegister.tags = _.map(tags, function(tag) {
              return {
                text: tag
              };
            });
            PostRegisterModel.imageDataArray = product.photos;
          })
          .catch(function error(err) {
            console.log(err);
          });
      }
    }

    function getSchools() {
      return Schools;
    }

    function toggleShowPhone(bool) {
      if (bool) {
        PostRegisterModel.form.showPhone = true;
      } else {
        PostRegisterModel.form.showPhone = false;
      }
    }

    function create() {
      Message.loading();
      if ($stateParams.type === 'local') {
        PostRegisterModel.form.type = 'local';
      } else if ($stateParams.type === 'abroad') {
        PostRegisterModel.form.type = 'abroad';
      }
      return postProduct()
        .then(function() {
          Message.hide();
          return Message.alert('상품 등록 알림', '상품이 성공적으로 등록되었습니다.');
        })
        .then(function(messageResp) {
          console.log(messageResp);
          reset();
          $state.go('main.postList', {
            type: $stateParams.type
          });
        })
        .catch(function(err) {
          Message.hide();
          console.log(err);
        });
    }

    function getPhoto(index) {
      var array = PostRegisterModel.imageDataArray;
      if (array[index] && typeof array[index] !== 'string') {
        return array[index].url;
      } else if (array[index] && typeof array[index] === 'string') {
        return array[index];
      }
    }

    function removePhoto(index) {
      var array = PostRegisterModel.imageDataArray;
      array.splice(index, 1);
    }

    function showCircle(index) {
      var array = PostRegisterModel.imageDataArray;
      if (array[index]) {
        return true;
      } else {
        return false;
      }
    }

    function update() {
      Message.loading();
      if ($stateParams.type === 'local') {
        PostRegisterModel.form.type = 'local';
      } else if ($stateParams.type === 'abroad') {
        PostRegisterModel.form.type = 'abroad';
      }
      // Seperate DataURI from cloudinary reference object;
      var array = PostRegisterModel.imageDataArray;
      var count = 0;
      for (var i = 0; i < array.length; i++) {
        if (array[i] && typeof array[i] !== 'string') {
          PostRegisterModel.form.photos.push(array[i]);
          count++;
        }
      }
      array.splice(0, count);
      return postProduct('PUT')
        .then(function() {
          Message.hide();
          return Message.alert('상품 업데이트 알림', '상품이 성공적으로 업데이트 되었습니다.');
        })
        .then(function(messageResp) {
          console.log(messageResp);
          reset();
          $state.go('main.postList', {
            type: $stateParams.type
          });
        })
        .catch(function(err) {
          Message.hide();
          console.log(err);
        });
    }


    function getImage(from) {
      var existingPhotos = PostRegister.Model.form.photos;
      if (!existingPhotos || existingPhotos.length === 0) {
        existingPhotos = [];
      }
      if (PostRegisterModel.imageDataArray.length + existingPhotos.length > 4) {
        Message.alert('사진올리기 알림', '사진은 최대 5개 올리실수 있습니다.');
      }
      ImageService.get({
        from: from,
        fileUris: PostRegisterModel.imageFileArray,
        dataUris: PostRegisterModel.imageDataArray
      });
    }

    function postProduct(method) {
      var ok = validateForm();
      var deferred = $q.defer();
      if (!ok) {
        deferred.reject(false);
        return deferred.promise;
      }
      PostRegisterModel.form.phone = Number(appStorage.user.phone);
      var schools = _.map(PostRegister.tags, function(tagObj) {
        return tagObj.text;
      });
      PostRegisterModel.form.school = schools.join(', ');
      return ImageService.post({
        url: '/product',
        dataUris: PostRegisterModel.imageDataArray,
        fields: PostRegisterModel.form
      }, method);
    }

    function reset() {
      PostRegisterModel.form = {
        showPhone: true
      };
      $timeout(function() {
        PostRegisterModel.imageFileArray = [];
        PostRegisterModel.imageDataArray = [];
        ImageService.clean();
      }, 0);
    }

    function validateForm() {
      var form = PostRegisterModel.form;
      var alert = Message.alert.bind(null, '상품등록 알림');
      if (!PostRegisterModel.imageDataArray[0] && $stateParams.method !== 'update') {
        alert('제품사진등록은 1개이상 필수입니다.');
        return false;
      } else if (!form.category && $stateParams.type === 'local') {
        alert('카테고리를 설정해주세요.');
        return false;
      } else if (!form.name) {
        alert('제목을 입력해주세요.');
        return false;
      } else if (!form.description) {
        alert('내용을 입력해주세요.');
        return false;
      } else if ((!PostRegister.tags || !PostRegister.tags[0]) && $stateParams.type === 'local') {
        alert('학교를 선택해주세요.');
        return false;
      } else if (!form.price && $stateParams.type === 'local') {
        alert('가격을 입력해주세요.');
        return false;
      } else if (!form.geoJSON && $stateParams.method !== 'update' && $stateParams.type === 'local') {
        alert('팔고싶은 장소를 입력후 서치버튼을 눌러 골라주세요.');
        return false;
      } else {
        return true;
      }
    }

    function searchPlace() {
      if (!PostRegisterModel.form.address) {
        return false;
      }
      var ps = new daum.maps.services.Places();
      Message.loading();
      ps.keywordSearch(PostRegisterModel.form.address, function(status, data) {
        // if no search result, notify and exit.
        Message.hide();
        if (data.places[0] === undefined) {
          Message.alert(
            '요청하신 장소가 없습니다',
            '다시검색해주세요'
          );
          return false;
        }
        PostRegisterModel.places = data.places;
        console.log(data.places);

      }, function(err) {
        console.log(err);
        Message.hide();
        Message.alert();
      });
    }

    function selectPlace(placeObj) {
      PostRegisterModel.form.address = placeObj.address;
      PostRegisterModel.form.geoJSON = {
        type: 'Point',
        coordinates: [Number(placeObj.longitude), Number(placeObj.latitude)]
      };
      PostRegisterModel.places = [];
      $ionicScrollDelegate.resize();
      console.log(PostRegisterModel.form.address);
      console.log(PostRegisterModel.form.geoJSON);
      console.log(typeof PostRegisterModel.form.geoJSON.coordinates[0]);
    }

  } //end
})();
