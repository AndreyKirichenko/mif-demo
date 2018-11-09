import '../scss/app.scss';
import '../pug/index.pug';

import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import onFinishRender from './on_finish_render'

import LiveBookShowcase from './live_book_showcase';
import ProductsShowcase from './products_showcase';
import Eye from './eye';


let app = angular.module('app', ['ngSanitize']);

app.directive('onFinishRender',['$timeout', '$parse', ($timeout, $parse) => {
  return onFinishRender($timeout, $parse);
}]);

app.controller('productShowcaseCtrl', ['$scope', '$http', ($scope, $http) => {
    new ProductsShowcase($scope, $http);
  }]
);

app.controller('eyeCtrl', ['$scope', ($scope) => {
  new Eye($scope);
}]);

app.controller('liveBookShowcaseCtrl', ['$scope', ($scope) => {
  new LiveBookShowcase($scope);
}]);

