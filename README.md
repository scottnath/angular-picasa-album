Angular Google Picasa Gallery
===========================

An AngularJS module to put a Google Plus (Picasa) album on a page.

## Usage

### Dependency in your app

You will need to include ```angularGPGallery``` in your list of app dependencies:

```
'use strict';

angular.module('angularApp', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute', 'angularGPGallery'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
	  	...
```

### Using the directive in your html

```
<div picasa="https://picasaweb.google.com/data/feed/base/user/111842695242051118098/albumid/6093822748921792961" img-width="916"></div>
```

#### Variables

`picasa` is the url to your picasa album

`img-width` is the maximum width for the main image