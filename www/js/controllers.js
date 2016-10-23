angular.module('starter').controller('SoundController', ['$ionicPlatform', '$timeout',  '$cordovaNativeAudio', 'socket', SoundController]);

function SoundController($ionicPlatform, $timeout, $cordovaNativeAudio) {
    var vm = this;

    vm.position = "Click somewhere and I'll return the position of your click.";

    $ionicPlatform.ready(function() {

        // all calls to $cordovaNativeAudio return promises

        $cordovaNativeAudio.preloadSimple('snare', 'audio/snare.mp3');
        $cordovaNativeAudio.preloadSimple('hi-hat', 'audio/highhat.mp3');
        $cordovaNativeAudio.preloadSimple('bass', 'audio/bass.mp3');
        $cordovaNativeAudio.preloadSimple('bongo', 'audio/bongo.mp3');
    });

    vm.play = function(sound) {
        $cordovaNativeAudio.play(sound);
    };

    function getPosition(element) {
        var xPosition = 0;
        var yPosition = 0;

        while(element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { x: xPosition, y: yPosition };
    }

    vm.launchPosition = function(){
      var tap = {x:0, y:0};
      vm.position = vm.getTouchposition(event);
      console.log(vm.position);
    }

    vm.getTouchposition = function(event){
      console.log("clicked");
      console.log(event);
      var canvasPosition = getPosition(event.gesture.touches[0].target);

      var tap = { x:0, y:0 };
              if(event.gesture.touches.length>0){
              tt = event.gesture.touches[0];
              tap.x = tt.clientX || tt.pageX || tt.screenX ||0;
              tap.y = tt.clientY || tt.pageY || tt.screenY ||0;
              }
       tap.x = tap.x - canvasPosition.x;
       tap.y = tap.y - canvasPosition.y;

       return {x: tap.x, y: tap.y};
    }

    return vm;
}
