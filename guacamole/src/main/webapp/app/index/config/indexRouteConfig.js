/*
 * Copyright (C) 2014 Glyptodon LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * The config block for setting up all the url routing.
 */
angular.module('index').config(['$routeProvider', '$locationProvider', 
        function indexRouteConfig($routeProvider, $locationProvider) {

    // Disable HTML5 mode (use # for routing)
    $locationProvider.html5Mode(false);

    /**
     * Attempts to re-authenticate with the Guacamole server, sending any
     * query parameters in the URL, along with the current auth token, and
     * updating locally stored token if necessary.
     *
     * @param {Service} $injector
     *     The Angular $injector service.
     * 
     * @returns {Promise}
     *     A promise which resolves successfully only after an attempt to
     *     re-authenticate has been made.
     */
    var updateCurrentToken = ['$injector', function updateCurrentToken($injector) {

        // Required services
        var $location             = $injector.get('$location');
        var $q                    = $injector.get('$q');
        var authenticationService = $injector.get('authenticationService');

        // Promise for authentication attempt
        var authAttempt = $q.defer();

        // Re-authenticate including any parameters in URL
        authenticationService.updateCurrentToken($location.search())
        ['finally'](function authenticationAttemptComplete() {
            authAttempt.resolve();
        });

        // Return promise that will resolve regardless of success/failure
        return authAttempt.promise;

    }];

    // Configure each possible route
    $routeProvider

        // Home screen
        .when('/', {
            title         : 'APP.NAME',
            bodyClassName : 'home',
            templateUrl   : 'app/home/templates/home.html',
            controller    : 'homeController',
            resolve       : { updateCurrentToken: updateCurrentToken }
        })

        // Management screen
        .when('/manage/', {
            title         : 'APP.NAME',
            bodyClassName : 'manage',
            templateUrl   : 'app/manage/templates/manage.html',
            controller    : 'manageController',
            resolve       : { updateCurrentToken: updateCurrentToken }
        })

        // Connection editor
        .when('/manage/connections/:id?', {
            title         : 'APP.NAME',
            bodyClassName : 'manage',
            templateUrl   : 'app/manage/templates/manageConnection.html',
            controller    : 'manageConnectionController',
            resolve       : { updateCurrentToken: updateCurrentToken }
        })

        // Connection group editor
        .when('/manage/connectionGroups/:id?', {
            title         : 'APP.NAME',
            bodyClassName : 'manage',
            templateUrl   : 'app/manage/templates/manageConnectionGroup.html',
            controller    : 'manageConnectionGroupController',
            resolve       : { updateCurrentToken: updateCurrentToken }
        })

        // User editor
        .when('/manage/users/:id', {
            title         : 'APP.NAME',
            bodyClassName : 'manage',
            templateUrl   : 'app/manage/templates/manageUser.html',
            controller    : 'manageUserController',
            resolve       : { updateCurrentToken: updateCurrentToken }
        })

        // Login screen
        .when('/login/', {
            title         : 'APP.NAME',
            bodyClassName : 'login',
            templateUrl   : 'app/login/templates/login.html',
            controller    : 'loginController'
            // No need to update token here - the login screen ignores all auth
        })

        // Client view
        .when('/client/:type/:id/:params?', {
            bodyClassName : 'client',
            templateUrl   : 'app/client/templates/client.html',
            controller    : 'clientController',
            resolve       : { updateCurrentToken: updateCurrentToken }
        })

        // Redirect to home screen if page not found
        .otherwise({
            redirectTo : '/'
        });

}]);


