import '../scss/app.scss';
import '../pug/index.pug';

import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import onFinishRender from './on_finidh_render'

import LiveBookShowcase from './live_book_showcase';
import ProductsShowcase from './products_showcase';

// new ProductsShowcase();

let app = angular.module('app', ['ngSanitize']);

app.directive('onFinishRender',['$timeout', '$parse', ($timeout, $parse) => {
  return onFinishRender($timeout, $parse);
}]);

app.controller('productShowcase', ['$scope', '$http', ($scope, $http) => {
    new ProductsShowcase($scope, $http);
  }]
);

document.addEventListener('DOMContentLoaded', function() {
  LiveBookShowcase();
});

function init() {
  ProductsShowcase();
}
