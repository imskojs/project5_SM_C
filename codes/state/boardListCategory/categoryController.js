(function() {
  'use strict';
  angular.module('app')
    .controller('CategoryController', CategoryController);

  CategoryController.$inject = ['CategoryModel', 'LinkService'];

  function CategoryController(CategoryModel, LinkService) {

    var Category = this;
    Category.Model = CategoryModel;

    Category.openLink = LinkService.openLink;


    //------------------------
    //  IMPLEMENTATIONS
    //------------------------
  }
})();
