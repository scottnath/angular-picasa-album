'use strict';

/*!
 * Angular Google Picasa Gallery
 * https://github.com/scottnath/angular-google-picasa-gallery
 * @license MIT
 * v0.1
 */

(function(){

angular.module('angularGPGallery', ['angular-google-picasa-gallery/picasa-template.html'])
  .directive('picasa', ['picasaService', function(picasaService) {
    return {
      //works on attribute
      restrict: 'A',
      replace: true,
      scope: { 
        picasa: '@',
        imgWidth: '@'
      },
      templateUrl: 'angular-google-picasa-gallery/picasa-template.html',
      link: function(scope, element, attrs) {
        if (attrs.height !== undefined && attrs.width !== undefined) {
          scope.size = 'both';
        } else {
          if (attrs.height !== undefined) {
            scope.size = 'height';
          }
          if (attrs.width !== undefined) {
            scope.size = 'width';
          }
        }
        scope.height = attrs.height;
        scope.width = attrs.width;

        if (attrs.thumbHeight !== undefined && attrs.thumbWidth !== undefined) {
          scope.thumbSize = 'both';
        } else {
          if (attrs.thumbHeight !== undefined) {
            scope.thumbSize = 'height';
          }
          if (attrs.thumbWidth !== undefined) {
            scope.thumbSize = 'width';
          }
        }
        scope.thumbHeight = attrs.thumbHeight;
        scope.thumbWidth = attrs.thumbWidth;

        scope.$watch('picasa', function () {
          if (scope.picasa === '') {
            return;
          }
          console.log('imgWidth');
          console.log(scope.imgWidth);
          if (scope.imgWidth === '') {
            scope.imgWidth = 912;
          }
          picasaService.get(scope.picasa,scope.imgWidth).then(function(data) {
            scope.photos = data;
            scope.current = data[0];
            scope.ready = true;
          })
        });
        
        scope.setCurrent = function(photo) {
          scope.current = photo;
        };
      }
    };
  }])
  .factory('picasaService', ['$http', '$q', function($http, $q) {
    // Service logic

    $http.defaults.useXDomain = true;
    
    function parsePhoto(entry) {
      var lastThumb = entry.media$group.media$thumbnail.length - 1
      var photo = {
        thumb: entry.media$group.media$thumbnail[lastThumb].url,
        thumbHeight: entry.media$group.media$thumbnail[lastThumb].height,
        thumbWidth: entry.media$group.media$thumbnail[lastThumb].width,
        url: entry.media$group.media$content[0].url
      };
      return photo;
    }
    
    function parsePhotos(url,imgWidth) {
      var d = $q.defer();
      var photo;
      var photos = [];
      loadPhotos(url,imgWidth).then(function(data) {
        if (!data.feed) {
          photos.push(parsePhoto(data.entry));
        } else {
          var entries = data.feed.entry;
          for (var i = 0; i < entries.length; i++) {
            photos.push(parsePhoto(entries[i]));
          }
        }
        d.resolve(photos);
        
      });
      return d.promise;
    }

    function loadPhotos(url,imgWidth) {
      var d = $q.defer();
      $http.jsonp(url + '?alt=json&kind=photo&hl=pl&imgmax=' + imgWidth + '&callback=JSON_CALLBACK').success(function(data, status) {
        d.resolve(data);
      });
      return d.promise;
    }

    // Public API here
    return {
      get : function (url,imgWidth) {
        return parsePhotos(url,imgWidth);
      }
    };
  }]);


  angular.module("angular-google-picasa-gallery/picasa-template.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("angular-google-picasa-gallery/picasa-template.html",
      '<div ng-show="ready">\n' +
      '  <div class="picasa-photo">\n' +
      '    <div ng-switch on="size">\n' +
      '      <span ng-switch-when="height">\n' +
      '        <img src="{{current.url}}" height="{{height}}">\n' +
      '      </span>\n' +
      '      <span ng-switch-when="width">\n' +
      '        <img src="{{current.url}}" width="{{width}}">\n' +
      '      </span>\n' +
      '      <span ng-switch-when="both">\n' +
      '        <img src="{{current.url}}" height="{{height}}" width="{{width}}">\n' +
      '      </span>\n' +
      '      <span ng-switch-default>\n' +
      '        <img src="{{current.url}}">\n' +
      '      </span>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '  <div class="picasa-thumbs">\n' +
      '    <div class="thumb-container" ng-switch on="thumbSize">\n' +
      '      <span ng-switch-when="height">\n' +
      '        <ul ng-repeat="photo in photos">\n' +
      '          <li>\n' +
      '            <a ng-mouseover="setCurrent(photo)">\n' +
      '              <img src="{{photo.thumb}}" height="{{thumbHeight}}">\n' +
      '            </a>\n' +
      '          </li>\n' +
      '        </ul>\n' +
      '      </span>\n' +
      '      <span ng-switch-when="width">\n' +
      '        <ul ng-repeat="photo in photos">\n' +
      '          <li>\n' +
      '            <a ng-mouseover="setCurrent(photo)">\n' +
      '              <img src="{{photo.thumb}}" width="{{thumbWidth}}">\n' +
      '            </a>\n' +
      '          </li>\n' +
      '        </ul>\n' +
      '      </span>\n' +
      '      <span ng-switch-when="both">\n' +
      '        <ul ng-repeat="photo in photos">\n' +
      '          <li>\n' +
      '            <a ng-mouseover="setCurrent(photo)">\n' +
      '              <img src="{{photo.thumb}}" height="{{thumbHeight}}" width="{{thumbWidth}}">\n' +
      '            </a>\n' +
      '          </li>\n' +
      '        </ul>\n' +
      '      </span>\n' +
      '      <span ng-switch-default>\n' +
      '        <ul ng-repeat="photo in photos">\n' +
      '          <li>\n' +
      '            <a ng-mouseover="setCurrent(photo)">\n' +
      '              <img src="{{photo.thumb}}">\n' +
      '            </a>\n' +
      '          </li>\n' +
      '        </ul>\n' +
      '      </span>\n' +
      '    </div>\n' +
      '  </div>\n' +
      '</div>\n'
      );
  }]);

})();
