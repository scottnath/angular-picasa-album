Angular Picasa Album
===========================

An AngularJS module to put a Google Plus (Picasa) album on a page.

This is a test script. Currently just shows the largest thumbnails and lets you scroll through them one-by-one.

## Usage

### Dependency in your app

You will need to include ```angularPicasaAlbum``` in your list of app dependencies:

```
'use strict';

angular.module('angularApp', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngRoute', 'angularPicasaAlbum'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
	  	...
```

### Using the directive in your html

```
<picasa user="106063255260898090789" albumid="6075652748550751457" img-width="916"></picasa>
```

### Adding the scroll buttons

There is a controller in Angular Picasa Album which allows you to add a couple buttons to move forward or back between the photos

```
<div ng-controller="slideshowController">
	<button ng-click="next()">NEXT</button>
	<button ng-click="previous()">PREV</button>
	<picasa user="106063255260898090789" albumid="6075652748550751457" img-width="916"></picasa>
</div>
```

#### Variables

The `user` attribute is the numerical id of a Picasa/Google Plus user

The `albumid` attribute is the numerical id of a Picasa/Google Plus photo album

`img-width` is the maximum width for the main image