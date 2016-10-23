app.factory('socket',function(socketFactory){
	//Create socket and connect to http://chat.socket.io
 	var myIoSocket = io.connect('http://192.168.43.52:3000/');

  	mySocket = socketFactory({
    	ioSocket: myIoSocket
  	});

	return mySocket;
})
