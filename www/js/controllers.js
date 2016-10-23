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

    var context;
    
    var socket = io();
    socket.on('liveStream', function(url) {
      //$('#stream').attr('src', url);
      $('#stream2').attr('src', url);

      var canvas = document.getElementById('myCanvas');
        context = canvas.getContext('2d');
        var imageObj = new Image();


        imageObj.onload = function() {
          context.drawImage(imageObj, 0, 0);

        };
        imageObj.src = url;

      $('.start').hide();
    });

    function startStream() {
      socket.emit('start-stream');
      $('.start').hide();
    }

    function getPixelAt(x,y){
      var cont = context.getImageData(x,y,1,1).data
      return {"r" : cont[0], "g" : cont[1], "b" : cont[2]};
    }

    function getVal(x,y){
      var rgb = getPixelAt(x,y);
      return rgb2hsv(rgb.r, rgb.g, rgb.b).v;
    }

    function rgb2hsv () {
        var rr, gg, bb,
            r = arguments[0] / 255,
            g = arguments[1] / 255,
            b = arguments[2] / 255,
            h, s,
            v = Math.max(r, g, b),
            diff = v - Math.min(r, g, b),
            diffc = function(c){
                return (v - c) / 6 / diff + 1 / 2;
            };

        if (diff == 0) {
            h = s = 0;
        } else {
            s = diff / v;
            rr = diffc(r);
            gg = diffc(g);
            bb = diffc(b);

            if (r === v) {
                h = bb - gg;
            }else if (g === v) {
                h = (1 / 3) + rr - bb;
            }else if (b === v) {
                h = (2 / 3) + gg - rr;
            }
            if (h < 0) {
                h += 1;
            }else if (h > 1) {
                h -= 1;
            }
        }
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            v: Math.round(v * 100)
        };
    }

    return vm;
}
