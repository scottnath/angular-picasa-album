'use strict';

/*!
 * Angular Picasa Album
 * https://github.com/scottnath/angular-picasa-album
 * @license MIT
 * v0.0.3
 */

(function(){
var numphotos;
angular.module('angularPicasaAlbum', ['angular-picasa-album/picasa-album-template.html'])
  .directive('picasa', ['picasaService', function(picasaService) {
    return {
      //works on attribute
      restrict: 'E',
      replace: true,
      scope: { 
        imgWidth: '@',
        user: '@',
        albumid: '@'
      },
      templateUrl: 'angular-picasa-album/picasa-album-template.html',
      link: function(scope, element, attrs) {

        scope.$watch('albumid', function () {
          if (scope.albumid === '') {
          	console.log('noalbumid');
            return;
          }
          if (scope.user === '') {
          	console.log('nouser');
            return;
          }
          if (scope.imgWidth === '') {
            scope.imgWidth = 912;
          }
          picasaService.get(scope.user,scope.albumid,scope.imgWidth).then(function(data) {
            scope.photos = data.feed.entry;
            numphotos = data.feed.entry.length;
            scope.ready = true;
          })
        });
        
      }
    };
  }])
  .controller('slideshowController', ['$scope', '$timeout', function($scope, $timeout) {
    
		$scope.slideshow = 1;
		$scope.next = function() {
			if(($scope.slideshow + 1) > numphotos){
				$scope.slideshow = 1;
			}else{
	  		$scope.slideshow = $scope.slideshow + 1;
	  	}
	  };
		$scope.previous = function() {
			if(($scope.slideshow - 1) < 1){
				$scope.slideshow = numphotos;
			}else{
	  		$scope.slideshow = $scope.slideshow - 1;
	  	}
	  };

	}])
  .factory('picasaService', ['$http', '$q', function($http, $q) {
    // Service logic

    $http.defaults.useXDomain = true;
    
    function loadPhotos(user,albumid,imgWidth) {
      var d = $q.defer();
      $http.jsonp('https://picasaweb.google.com/data/feed/base/user/' + user + '/albumid/' + albumid + '?alt=json&kind=photo&hl=pl&imgmax=' + imgWidth + '&callback=JSON_CALLBACK').success(function(data, status) {
        d.resolve(data);
      });
      return d.promise;
    }

    // Public API here
    return {
      get : function (user,albumid,imgWidth) {
        return loadPhotos(user,albumid,imgWidth);
      }
    };
  }]);


  angular.module("angular-picasa-album/picasa-album-template.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-picasa-album/picasa-album-template.html",
      '<div ng-repeat="s in photos track by $index" class="slider-content">\n' + 
      '  <img ng-if="slideshow == $index +1" src="{{s.media$group.media$thumbnail[2].url}}"></div>\n'
      
      );
  }]);

})();
