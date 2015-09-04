'use strict';

/**
 * @ngdoc function
 * @name binowPlayingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the binowPlayingApp
 */

function twitterSearch(response) {
    console.log(response);
}
angular.module('binowPlayingApp')
    .controller('MainCtrl', function ($scope, $resource, $http) {

    });

//inject the twitterService into the controller
angular.module('binowPlayingApp').controller('TwitterController', function ($scope, $q, twitterService, $sce, $timeout, Utils) {

    $scope.tweets; //array of tweets


    //Necesary to bind "unsecure" url of youtube video using angular
    $scope.trustSrc = function (src) {
        var code = src.split('/');
        return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + code[code.length - 1]);
    };

    twitterService.initialize();

    //using the OAuth authorization result get the latest 20 tweets from twitter for the user
    $scope.refreshTimeline = function () {
        twitterService.getNowPlayingTweets().then(function (data) {

            $scope.tweets = data.statuses;

        });
    };

    //when the user clicks the connect twitter button, the popup authorization window opens
    $scope.connectButton = function () {
        twitterService.connectTwitter().then(function () {
            if (twitterService.isReady()) {
                //if the authorization is successful, hide the connect button and display the tweets
                $('#connectButton').fadeOut(function () {
                    $('#getTimelineButton, #signOut, .withlogin').fadeIn();
                    $scope.refreshTimeline();
                });
            }
        });
    }

    //sign out clears the OAuth cache, the user will have to reauthenticate when returning
    $scope.signOut = function () {
        twitterService.clearCache();
        $scope.tweets.length = 0;
        $('#getTimelineButton, #signOut, .withlogin').fadeOut(function () {
            $('#connectButton').fadeIn();
        });
    };

    //Post tweet functionality to try to send coordinates to it
    $scope.postTweet = function () {
        twitterService.postTweet($scope.comment + ' ' + $scope.video).then(function () {
            $scope.video = "";
            $scope.comment = "";
            $scope.refreshTimeline();
        })
    };

    //Simple function to genetate dates ago (1 day ago)
    $scope.calculateSince = function (datetime) {
        return Utils.calculateSince(datetime);
    };

    //if the user is a returning user, hide the sign in button and display the tweets
    if (twitterService.isReady()) {
        $('#connectButton').hide();
        $('#getTimelineButton, #signOut, .withlogin').show();
        $scope.refreshTimeline();
    }
    else {
        $('#getTimelineButton, #signOut, .withlogin').hide();
    }

    $timeout(function () {
        $scope.refreshTimeline();
    }, 60000);

});
