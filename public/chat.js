$(document).ready(function() {
	var messages = [],
	 		socket = io.connect('http://'+location.host),
	 		field = document.getElementById('field'),
	 		sendButton = document.getElementById('send'),
	 		content = document.getElementById('content'),
	 		name = document.getElementById('name');

	socket.on('message', function (data) {
		if(data.message) {
			messages.push(data);
			var html = '';
			var d = new Date();
			var timeSubmitted = ` ${d.getMonth()}-${d.getDay()} ${d.getHours()}:${d.getMinutes()} pst`;
			for(var i=0; i<messages.length; i++) {
				html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
				html += messages[i].message  + '<div style="font-size:80%; float:right;">' + timeSubmitted + '</div>\n' + '<br />';
			}
			content.innerHTML = html;
		} else {
			console.log('There is a problem:', data);
		}
	});

	sendButton.onclick = sendMessage = function() {
		if(name.value === '') {
			alert('Please type your name!');
		} else {
			var text = field.value;
			socket.emit('send', { message: text, username: name.value });
			field.value = '';
		}
	};

	$('#field').keyup(function(e) {
		if(e.keyCode === 13) {
			sendMessage();
		}
	});
});
