function contactsPopup() {
	var popup = document.getElementById("contactsPopup");
	popup.classList.toggle("show");
}

function picSwap() {
	var picList = ["pic1.png", "pic2.jpg", "pic3.jpg", "pic1.png"];
	var pic = document.getElementById("picGallery");
	var name = pic.src;
	name = name.substring(name.length - 8, name.length);
	for (i = 0; i < 3; i++) {
		if(name == picList[i]) {
			pic.src = picList[i+1];
		}
	}
}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function deleteMessage(e) {
	e.target.parentNode.remove();
}

function chatMessage() {
	var chatMessageBox = document.getElementById("chatMessageBox");

	var message = document.createElement("div");
	message.classList.toggle("chatMessage");
	message.classList.toggle("chatMessage1");
	var img1 = document.createElement("img");
	img1.classList.toggle("chatCross");
	img1.src = "cross.png";
	img1.onclick = deleteMessage;
	message.appendChild(img1);
	message.appendChild(document.createTextNode(document.getElementById("chatText").value));
	chatMessageBox.append(message);

	var adj = ["Белая", "Серая", "Черная"];
	var noun = ["лисичка", "кошечка", "поняша"];
	var verb = ["стоит", "сидит", "лежит"];
	var text = adj[getRandomInt(3)] + " " + noun[getRandomInt(3)] + " " + verb[getRandomInt(3)];

	var answerMessage = document.createElement("div");
	answerMessage.classList.toggle("chatMessage");
	answerMessage.classList.toggle("chatMessage2");	
	var img2 = img1.cloneNode(true);
	img2.onclick = deleteMessage;
	answerMessage.appendChild(img2);
	answerMessage.appendChild(document.createTextNode(text));
	chatMessageBox.append(answerMessage);

	chatMessageBox.scrollTop = chatMessageBox.scrollHeight;
}