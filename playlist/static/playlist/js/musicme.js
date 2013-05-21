var votes = new Object();

function createUpvoteBtn(ele) {
	return "<div class='upvotebuttonContainer'><button class='tiny button radius upvotebutton' style='background-color: gray; border: gray;' id='up_" + ele.songid + "'>^</button></div>";
}

function createPlaylistElement(ele){
	var html = "<div class='panel songpanel'>" /*+ createPlayBtn(ele)*/ + ele.songtitle + " - " + ele.artist + "<div id='voteContainer'>" + createUpvoteBtn(ele)+ createDownBtn(ele) + "<b id='votes'>" + ele.votecount + " </b>" + "</div>" + "</div>";
	
	return html; 
}

//function createPlayBtn(ele) {
//	var html = "<button class='small button playButton' id='play_" + ele.songid + "'>PLAY</button>";
//	return html;
//}

function clearList() {
	$('#playlist').empty();
}

function createDownBtn(ele){
	return "<div class='downvotebuttonContainer'><button class='tiny button radius downvotebutton' style='background-color: gray; border: gray;' id='down_" + ele.songid + "'>v</button></div>";
}

(function( musicPlayer, $, undefined){

  musicPlayer.curTrackObject = null;
  musicPlayer.curTrackIndex = 0;
  musicPlayer.curTrackPosn = 0;

  musicPlayer.setStarted = false;
  musicPlayer.setPaused = false;

	musicPlayer.createTrackObject = function(track_ele) {
		var track = window.tomahkAPI.Track(track_ele.songtitle,track_ele.artist, {
    		width:300,
    		height:300,
        autoplay:1,
    		disabledResolvers: [
    			"Youtube", "Spotify"
        	
            // options: "SoundCloud", "Officialfm", "Lastfm", "Jamendo", "Youtube", "Rdio", "SpotifyMetadata", "Deezer", "Exfm"
    		],
    		handlers: {
		        onloaded: function() {
		            // console.log(track.connection+":\n  api loaded");
		        },
		        onended: function() {
		        //     console.log(track.connection+":\n  Song ended: "+track.artist+" - "+track.title);
		        },
		        onplayable: function() {
		            // console.log(track.connection+":\n  playable");
		        },
		        onresolved: function(resolver, result) {
		            // console.log(track.connection+":\n  Track found: "+resolver+" - "+ result.track + " by "+result.artist);
		        },
		        ontimeupdate: function(timeupdate) {
		            var currentTime = timeupdate.currentTime;
		            var duration = timeupdate.duration;
		            currentTime = parseInt(currentTime);
		            duration = parseInt(duration);

		            // console.log(track.connection+":\n  Time update: "+currentTime + " "+duration);
		        },
            onended: function() {
              musicPlayer.curTrackIndex += 1;
              if ((musicPlayer.curTrackIndex < handleList.SONG_LIST.length) && (musicPlayer.curTrackIndex > 0)) {
                console.log("playing next");
              } else {
                musicPlayer.curTrackIndex = 0;
              }
              musicPlayer.curTrackObject = musicPlayer.createTrackObject(handleList.SONG_LIST[musicPlayer.curTrackIndex]);
              $("#playlist_video_area").empty().append(musicPlayer.curTrackObject.render());
            },
            onpause: function() {
              // only allow pausing via pause all button
              console.log(musicPlayer);
              if (musicPlayer.setPaused == false) {
                musicPlayer.curTrackObject.play();
              }
            }
    		}
		});
		return track
	}
}( window.musicPlayer = window.musicPlayer || {}, jQuery ));

/* Proper coding practice: http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/ */
//Self-Executing Anonymous Func: Part 2 (Public & Private)
(function( handleList, $, undefined){

      // check if a dictionary is empty
      handleList.isEmpty = function(dict) {
        for (var prop in dict) {
          if (dict.hasOwnProperty(prop)) {
            return false;
          }
          }
          return true;
      };

      // dictionary with key=songid, value=votecount
      var CACHED_VOTES = {};
      // refresh every minute
      var REFRESH_INTERVAL = 10000;


	      // timer to flush cache and refresh
      /*setInterval(function(){
        if (isEmpty(CACHED_VOTES) == false) {
          {% load update_cache %}
          //song_list = {{ CACHED_VOTES|update_votes }};
        }
        CACHED_VOTES = {};
        {% autoescape off %}
          showList({{ song_list }});
        {% endautoescape %}
      },REFRESH_INTERVAL);
    */
     handleList.showList = function(list) {
      var html = "";
      list.sort(function(a,b) {
        if (a.votecount > b.votecount)
          return -1;
        if (a.votecount < b.votecount)
          return 1;
        return 0;
      });
      for(var i in list) {
        html += createPlaylistElement(list[i]);
      }

      function changeVote(delta,id) {
        // for now, just update the vote count from the cache entirely on the front end
          for (var i in handleList.SONG_LIST) {

          if (handleList.SONG_LIST[i].songid == id) {
            if (delta > 0) {
              if (handleList.SONG_LIST[i].upbtndisable == "False"){
                handleList.SONG_LIST[i].votecount += delta;
                handleList.SONG_LIST[i].upbtndisable = "True";
              }
              else{
                handleList.SONG_LIST[i].votecount -= delta;
                handleList.SONG_LIST[i].upbtndisable = "False";
              }
            }
            else {
              if (handleList.SONG_LIST[i].downbtndisable == "False"){
                handleList.SONG_LIST[i].votecount += delta;
                handleList.SONG_LIST[i].downbtndisable = "True";
              }
              else{
                handleList.SONG_LIST[i].votecount -= delta;
                handleList.SONG_LIST[i].downbtndisable = "False";
              }

            }
          }
        }

          clearList();          
          handleList.showList(handleList.SONG_LIST);
          //loop through the list to see which song has been down voted and up voted, and disable that btn
          for (var i in handleList.SONG_LIST) {
            if (handleList.SONG_LIST[i].upbtndisable == "True") {
                document.getElementById('down_'+handleList.SONG_LIST[i].songid).disabled = true;
                $('#up_'+handleList.SONG_LIST[i].songid).css("background-color", "#5da423");
            }
            if(handleList.SONG_LIST[i].downbtndisable == "True"){
                document.getElementById('up_'+handleList.SONG_LIST[i].songid).disabled = true;
                $('#down_'+handleList.SONG_LIST[i].songid).css("background-color", "#c60f13"); 
            } 
          }
        }


      $('#playlist').append(html);
      // event handler for click on upvote button
      $('.upvotebutton').click(function() {
        var prefix = "up_";
        var id = $(this).attr('id').substring(prefix.length);
        changeVote(1,id);
      });

      $('.downvotebutton').click(function() {
        var prefix = "down_";
        var id = $(this).attr('id').substring(prefix.length);
        changeVote(-1,id);
      })

    };
}( window.handleList = window.handleList || {}, jQuery ));

$(document).ready(function() {
    $('#addSong').submit(function() {

      $('#addedSongNotif').fadeTo('slow', 1);
      var t = setTimeout(function(){
        $('#addedSongNotif').fadeTo('slow', 0);
        var f = setTimeout(function(){
          $('#addedSongNotif').css("display", "none");
        }, 500);
        
      },3000);

      $.ajax({ 
          data: $(this).serialize(), 
          type: $(this).attr('method'), 
          url: $(this).attr('action'), 
          success: function(response) { 
              $('#message').html(response); 
          },
          error: function(e, x, r) { 
              $('#error_div').html(e); 
          }
      });
      return false;
    });

  $('#playPlaylistBtn').click(function() {

    musicPlayer.setPaused = false;

    $(this).css("display","none");
    $("#pausePlaylistBtn").css("display","block");

    console.log(musicPlayer);

    if (musicPlayer.setStarted == false) {
      musicPlayer.setStarted = true;
      musicPlayer.curTrackObject = musicPlayer.createTrackObject(handleList.SONG_LIST[musicPlayer.curTrackIndex]);
      $("#playlist_video_area").empty().append(musicPlayer.curTrackObject.render());
    }
    musicPlayer.curTrackObject.play();

  });

  $('#pausePlaylistBtn').click(function() {
    musicPlayer.setPaused = true;
    $(this).css("display","none");
    $("#playPlaylistBtn").css("display","block");

    musicPlayer.curTrackObject.pause();
  });

});
