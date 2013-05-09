function createUpvoteBtn(ele) {
	return "<div class='upvotebuttonContainer'><button class='tiny button success radius upvotebutton' id=up_" + ele.songid + ">^</button></div>";
}

function createPlaylistElement(ele){
	var html = "<div class='panel'>" + ele.songtitle + " - " + ele.artist + " " + "<b>" + ele.votecount + " votes</b>" + createUpvoteBtn(ele)+ createDownBtn(ele) + "</div>";
	
	return html; 
}

function clearList() {
	$('#playlist').empty();
}

function createDownBtn(ele){
	return "<div class='downvotebuttonContainer'><button class='tiny button alert radius downvotebutton' id=down_" + ele.songid + ">v</button></div>";
}