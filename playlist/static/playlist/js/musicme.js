function createPlaylistElement(ele){
	var html = "<div class='panel'>" + ele.songtitle + " - " + ele.artist + " " + "<b>" + ele.votecount + " votes</b></div>"
	return html; 
}

function showList(list){
	var html = "";
	for(var i in list){
		html += createPlaylistElement(list[i]);
		console.log(html);
	}
	$('#playlist').append(html);
}