var votes = new Object();

function createUpvoteBtn(ele) {
	return "<div class='upvotebuttonContainer'><button class='tiny button radius upvotebutton' style='background-color: gray; border: gray;' id='up_" + ele.songid + "'>^</button></div>";
}

function createPlaylistElement(ele){
	var html = "<div class='panel songpanel'>" + createPlayBtn(ele) + createUpvoteBtn(ele)+ createDownBtn(ele) + ele.songtitle + " - " + ele.artist + " " + "<b>" + ele.votecount + " votes</b>" + "</div>";
	
	return html; 
}

function createPlayBtn(ele) {
	var html = "<div class='playbuttonContainer'><button class='small button' id='play_" + ele.songid + "'>PLAY</button></div>";
	return html;
}

function clearList() {
	$('#playlist').empty();
}

function createDownBtn(ele){
	return "<div class='downvotebuttonContainer'><button class='tiny button radius downvotebutton' style='background-color: gray; border: gray;' id='down_" + ele.songid + "'>v</button></div>";
}

(function( musicPlayer, $, undefined){
	musicPlayer.createTrackObject = function(track_ele) {
		var track = window.tomahkAPI.Track(track_ele.songtitle,track_ele.artist, {
    		width:300,
    		height:300,
    		disabledResolvers: [
    			"tomahawk"
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
		        }
    		}
		});
		return track
	}
}( window.musicPlayer = window.musicPlayer || {}, jQuery ));

/* Proper coding practice: http://enterprisejquery.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/ */
//Self-Executing Anonymous Func: Part 2 (Public & Private)
(function( handleList, $, undefined){

      var UPVOTE_DELAY = 20000;

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
            //console.log(SONG_LIST[i].songid);
            if (handleList.SONG_LIST[i].songid == id) {
              var prevvote = votes[id];
              if(prevvote==undefined){
                // Update as normal
                handleList.SONG_LIST[i].votecount += delta;
                votes[id] = delta;
              }
              else if((prevvote==1 && delta==-1) || (prevvote==-1 && delta==1)){
                // Downvote 2
                handleList.SONG_LIST[i].votecount += 2*delta;
                votes[id] = delta;
              }
              else if((prevvote==1 && delta==1) || (prevvote==-1 && delta==-1)){
                // Undo vote, revert to original value
                handleList.SONG_LIST[i].votecount -= delta;
                votes[id] = undefined;
              }
              else{
                // Do nothing.
              }

              // handleList.SONG_LIST[i].votecount += delta;
              // if (delta > 0) handleList.SONG_LIST[i].upbtndisable = "disable";
              // else handleList.SONG_LIST[i].downbtndisable = "disable";
            }
          }
          clearList();          
          handleList.showList(handleList.SONG_LIST);
          //loop through the list to see which song has been down voted and up voted, and disable that btn
          for (var i in handleList.SONG_LIST) {
            if (handleList.SONG_LIST[i].upbtndisable == "disable") {
                document.getElementById('up_'+handleList.SONG_LIST[i].songid).disabled = true;
            }
            if(handleList.SONG_LIST[i].downbtndisable == "disable"){
                document.getElementById('down_'+handleList.SONG_LIST[i].songid).disabled = true;
            } 
          }

          //Change colors of buttons according to up/down
          if(prevvote==undefined){                
                if(delta==1){
                  // Make upv button green #5da423
                  $('#up_'+id).css("background-color", "#5da423");                
                }
                if(delta==-1){
                  // Make downv button red #c60f13
                  $('#down_'+id).css("background-color", "#c60f13");                  
                }
              }
              else if((prevvote==1 && delta==-1) || (prevvote==-1 && delta==1)){
                // Downvote 2

                if(prevvote==1 && delta==-1){
                  //Make upv button gray, downv button red
                  $('#down_'+id).css("background-color", "#c60f13");
                  $('#up_'+id).css("background-color", "gray");

                }
                if(prevvote==-1 && delta==1){
                  //Make downv button gray, upv button greed
                  $('#up_'+id).css("background-color", "#5da423");
                  $('#down_'+id).css("background-color", "gray");
                }
              }
              else if((prevvote==1 && delta==1) || (prevvote==-1 && delta==-1)){
                // Undo vote, revert to original value

                // Make both buttons gray
                $('#up_'+id).css("background-color", "gray")
                $('#down_'+id).css("background-color", "gray")
              }
              else{
                // Do nothing.
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



  $(document).ready(function () {

  $("#submit").click(function(e) {
    // e.preventDefault();
    
    $.ajax({
      url: "/add/",
    }).done(function ( data ) {
      if( console && console.log ) {
        console.log("Sample of data:", data);
      }
    });


  });

});