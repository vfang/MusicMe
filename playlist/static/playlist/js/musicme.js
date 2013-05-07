function createPlaylistElement(ele){
	var html = "<div class='panel'>" + ele.songtitle + " - " + ele.artist + " " + "<b>" + ele.count + " votes</b></div>"
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

var fake = [{"songtitle":"Fake Song", "artist":"Corey McMahon", "count":6},
{"songtitle":"Fake Song 2", "artist":"Erlin", "count":3}]


$(document).ready(function(){
	console.log("running")
;	showList(fake);
})
