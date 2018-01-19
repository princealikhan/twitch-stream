/**
 * Created by princealikhan on 19/01/18.
 */
var app = angular.module('twitchApp', []);

app.controller('appController', function($scope,$http) {

    $scope.streamInfo = [
        {
            channel : "freecodecamp",
            data : {}
        },
        {
            channel : "cretetion",
            data : {}
        },
        {
            channel : "ESL_SC2",
            data : {}
        },
        {
            channel : "OgamingSC2",
            data : {}
        },
        {
            channel : "storbeck",
            data : {}
        },
        {
            channel : "RobotCaleb",
            data : {}
        },
        {
            channel : "noobs2ninjas",
            data : {}
        }
    ];

    $scope.holdOn = true;
    $scope.totalChannel = $scope.streamInfo.length;
    $scope.iteration = 0;

    $scope.makeRequestUrl = function(name){
        return 'https://wind-bow.glitch.me/twitch-api/streams/' + name;
    }

    // Simple GET Request:
    $scope.getStreams = function (requestUrl,dataKey) {
        $http({
            cache: false,
            method: 'GET',
            url: requestUrl,
        }).then(function successCallback(response) {

            if(_.isEmpty(response.data) == false){

                var responseData = response.data;

                if(_.hasIn(responseData, 'stream') == true && _.isNull(responseData.stream) == false){

                    let streamProcess = {};

                    if(responseData.stream.hasOwnProperty('stream_type') == true){
                        streamProcess.type = responseData.stream.stream_type.toUpperCase();
                    }

                    if(responseData.stream.hasOwnProperty('channel') == true){
                        streamProcess.name = responseData.stream.channel.display_name;
                    }

                    if(responseData.stream.hasOwnProperty('preview') == true){
                        streamProcess.preview = responseData.stream.preview.medium;
                    }

                    if(_.hasIn(responseData,'stream.channel.profile_banner_background_color')){
                        streamProcess.background = responseData.stream.channel.profile_banner_background_color;
                    }


                    $scope.streamInfo[dataKey].data = streamProcess;

                    console.log('NICE');

                }else{
                    $scope.streamInfo[dataKey].data = {
                        'type' : null,
                        'name' : _.startCase($scope.streamInfo[dataKey].channel),
                        'preview' : false,
                        'background' : ''
                    }
                }

            }


        }, function errorCallback(response) {
            console.error(response);
        });


    }

    $scope.streamInfo.forEach(function (data, key) {
        var requestUrl = $scope.makeRequestUrl(data.channel);
        $scope.iteration += 1;
        $scope.getStreams(requestUrl,key);

        if($scope.totalChannel == $scope.iteration){
            $scope.holdOn = false;
        }
    });
});