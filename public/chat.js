$(document).ready(function() {
	let messages = [],
	 		socket = io.connect('http://'+location.host),
	 		field = document.getElementById('field'),
	 		sendButton = document.getElementById('send'),
	 		content = document.getElementById('content'),
			name = prompt("Enter username for chat");

	socket.on('message', function (data) {
		if(data.message) {
			messages.push(data);
			let html = '',
				  timeSubmitted = getTime(),
					i = 0, length = messages.length;

			for(i; i < length; i++) {
				html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
				html += messages[i].message  + '<div style="font-size:80%; float:right;">' + timeSubmitted + '</div>\n' + '<br />';
			}
			content.innerHTML = html;
		} else {
			console.log('There is a problem:', data);
		}
	});

	sendButton.onclick = sendMessage = function() {
		if(name === '') {
			field.value = '';
			name = prompt('Please type your name!');
		} else {
			let text = field.value;
			socket.emit('send', { message: text, username: name });
			field.value = '';
		}
	};

	$('#field').keyup(function(e) {
		if(e.keyCode === 13) {
			sendMessage();
		}
	});

	setFocus();
});

function setFocus () {
	var input = document.getElementById("field");
	input.focus();
}

function getTime() {
	let d = new Date(),
			hours = d.getHours(),
			month = d.getMonth(),
			minutes = d.getMinutes(),
			monthNames = ["January", "February", "March", "April", "May", "June",
										"July", "August", "September", "October", "November", "December"];
	hours = hours > 12 ? hours - 12: hours;
	return ` ${monthNames[d.getMonth()]} ${d.getDay()} ${hours}:${minutes} pst`;
}
