$(document).ready(function() {
	let messages = [],
	 		socket = io.connect('http://'+location.host),
	 		field = document.getElementById('field'),
	 		sendButton = document.getElementById('send'),
	 		content = document.getElementById('content'),
			//the element that is the Who's On list
			users = document.getElementById('usersActive'),
			//represents the names in the Who's On list
			userhtml = '';
			name = prompt("Enter username for chat");
  //emits event upon socket.io connecting to server
	socket.emit('users', {username: name});

  socket.on('message', function (data) {
		//data object has username & message of sender
		if(data.message) {
			//array of every message sent while in session
			messages.push(data);
			let html = '',
				  timeSubmitted = getTime(),
					i = 0, length = messages.length;

			for(i; i < length; i++) {
				html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
				html += messages[i].message  + '<div style="font-size:80%; float:right;">' + timeSubmitted + '</div>\n' + '<br />';
				//adds name to Who's On list to replace having to use a database by checking if username of sender is in list or not & adds it if it's not
				let str = users.innerHTML;
				if(str.indexOf(messages[i].username) === -1 && messages[i].username !== undefined) {
					console.log('problems are everywhere sir!');
					users.innerHTML += messages[i].username + '<br />';
				}
			}
			content.innerHTML = html;
		} else {
			console.log('There is a problem:', data);
		}
	});
	//deals with the validation of the username & adds name to Who's On list
	socket.on('name', function(data) {
		name = data.username;
		while(name === '') {
				name = prompt('Please enter a valid username');
		}
		//gives user the name 'anonymous' if they decide to click cancel when prompt is triggered
		if(name === 'null' || name.toUpperCase() === 'Server'.toUpperCase()) {
			name  = 'anonymous';
		}
		users.innerHTML += name + '<br />';
	});
	//upon send button being clicked 'send' event is emitted with object & its properties are later used in the 'message' event handler
	sendButton.onclick = sendMessage = function() {
			let text = field.value;
			socket.emit('send', { message: text, username: name });
			field.value = '';
	};

	$('#field').keyup(function(e) {
		if(e.keyCode === 13) {
			sendMessage();
		}
	});

	setFocus();
});
//focuses immediately on input field to make it easier to send messages
function setFocus () {
	let input = document.getElementById("field");
	input.focus();
}
//returns the time of the message being sent
function getTime() {
	let d = new Date(),
			hours = d.getHours(),
			month = d.getMonth(),
			minutes = d.getMinutes(),
			monthNames = ["January", "February", "March", "April", "May", "June",
										"July", "August", "September", "October", "November", "December"];
	hours = hours > 12 ? hours - 12: hours;
	return ` ${monthNames[d.getMonth()]} ${d.getDate()} ${hours}:${minutes} pst`;
}
