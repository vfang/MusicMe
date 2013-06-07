(function(voteCookie,$,undefined){
	voteCookie.NAME = "musicme-vote-cookie";
	var SONGMAP = loadSongmap();
	voteCookie.toggleSongVoteStatus = function(songid,voteDelta) { // vote is either +1 or -1
		if (SONGMAP[songid] == undefined) {
			SONGMAP[songid] = voteDelta;
		} else {
			if (SONGMAP[songid] == voteDelta) {
				SONGMAP[songid] = undefined;
			} else {
				SONGMAP[songid] = voteDelta;
			}
		}
		// set cookie
		$.cookie(voteCookie.NAME,JSON.stringify(SONGMAP));
		console.log("cookie value: ",$.cookie(voteCookie.NAME));
	}

	voteCookie.getSongmap = function() {
		var cookieVal = $.cookie(voteCookie.NAME);
		if (cookieVal) {
			SONGMAP = JSON.parse(cookieVal);
		}
		return SONGMAP;
	}
	function loadSongmap() {
		var cookieVal = $.cookie(voteCookie.NAME);
		if (cookieVal) {
			return JSON.parse(cookieVal);
		}
		return {};
	}

	voteCookie.restoreVotes = function() {
		var songmap = voteCookie.getSongmap();
		//console.log(handleList.SONG_LIST);
		// console.log("songmap = ", songmap);
	      for (var i in handleList.SONG_LIST) {
	        var song = handleList.SONG_LIST[i];
	        if (songmap[song.songid] != undefined) {
	          var vote_val = songmap[song.songid];
	          if (vote_val == 1) {
	            handleList.SONG_LIST[i].upbtndisable = "True";
	            console.log("upbtndisabled for songid = ",song.songid);
	          } else {
	            handleList.SONG_LIST[i].downbtndisable = "True";
	            console.log("downbtndisabled for songid = ",song.songid);
	          }
	        }
	      }
	      // console.log("votes restored.");
	}

	voteCookie.deleteSong = function(songid) {
		if (SONGMAP[songid] == undefined) {
			console.log("Error: can't delete a song from cookie that doesn't exist to begin with");
			return
		} else {
			console.log("Deleting song from cookie")
			SONGMAP[songid] = undefined
		}
		// set cookie
		$.cookie(voteCookie.NAME,JSON.stringify(SONGMAP));
		console.log("cookie value: ",$.cookie(voteCookie.NAME));
	}

}( window.voteCookie = window.voteCookie || {}, jQuery ));