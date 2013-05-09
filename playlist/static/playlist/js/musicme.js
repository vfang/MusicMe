function createUpvoteBtn(ele) {
	return "<div class='upvotebuttonContainer'><button class='tiny button success radius upvotebutton' id=" + ele.songid + ">^</button></div>";
}

function createPlaylistElement(ele){
	var html = "<div class='panel'>" + ele.songtitle + " - " + ele.artist + " " + "<b>" + ele.votecount + " votes</b>" + createUpvoteBtn(ele) + "</div>";
	return html; 
}

function clearList() {
	$('#playlist').empty();
}