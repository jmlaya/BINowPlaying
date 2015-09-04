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
angular.module('binowPlayingApp').controller('TwitterController', function ($scope, $q, twitterService, $sce, $timeout) {

    $scope.tweets; //array of tweets

    $scope.trustSrc = function (src) {
        var code = src.split('/');
        return $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + code[code.length - 1]);
    }

    $scope.getTweet = function (id) {
        var defer = $q.defer
        twitterService.getTweet(id).then(function (tweet) {

        })
        return defer.promise;
    }

    twitterService.initialize();

    //using the OAuth authorization result get the latest 20 tweets from twitter for the user
    $scope.refreshTimeline = function () {
        twitterService.getNowPlayingTweets().then(function (data) {

            $scope.tweets = data.statuses;

        });
    }

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

    $scope.postTweet = function () {
        twitterService.postTweet($scope.comment + ' ' + $scope.video).then(function () {
            $scope.video = "";
            $scope.comment = "";
            $scope.refreshTimeline();
        })
    };

    $scope.calculateSince = function (datetime) {
        var tTime = new Date(datetime);
        var cTime = new Date();
        var sinceMin = Math.round((cTime - tTime) / 60000);
        if (sinceMin == 0) {
            var sinceSec = Math.round((cTime - tTime) / 1000);
            if (sinceSec < 10)
                var since = 'less than 10 seconds ago';
            else if (sinceSec < 20)
                var since = 'less than 20 seconds ago';
            else
                var since = 'half a minute ago';
        }
        else if (sinceMin == 1) {
            var sinceSec = Math.round((cTime - tTime) / 1000);
            if (sinceSec == 30)
                var since = 'half a minute ago';
            else if (sinceSec < 60)
                var since = 'less than a minute ago';
            else
                var since = '1 minute ago';
        }
        else if (sinceMin < 45)
            var since = sinceMin + ' minutes ago';
        else if (sinceMin > 44 && sinceMin < 60)
            var since = 'about 1 hour ago';
        else if (sinceMin < 1440) {
            var sinceHr = Math.round(sinceMin / 60);
            if (sinceHr == 1)
                var since = 'about 1 hour ago';
            else
                var since = 'about ' + sinceHr + ' hours ago';
        }
        else if (sinceMin > 1439 && sinceMin < 2880)
            var since = '1 day ago';
        else {
            var sinceDay = Math.round(sinceMin / 1440);
            var since = sinceDay + ' days ago';
        }
        return since;
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

});
