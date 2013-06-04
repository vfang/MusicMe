(function( musicPlayer, $, undefined){

  musicPlayer.curTrackObject = null;

  musicPlayer.setStarted = false;
  musicPlayer.setPaused = false;

  musicPlayer.createTrackObject = function(track_ele) {
    var track = window.tomahkAPI.Track(track_ele.songtitle,track_ele.artist, {
      width:300,
      height:300,
      autoplay:1,
      disabledResolvers: [
      "SoundCloud", "SpotifyMetadata"

            // options: "SoundCloud", "Officialfm", "Lastfm", "Jamendo", "Youtube", "Rdio", "SpotifyMetadata", "Deezer", "Exfm"
            ],
            handlers: {
              onloaded: function() {
                // console.log(track.connection+":\n  api loaded");
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


                //For DEMO only
                if($('#progress_bar').width() > '10%'){
                  console.log('MOOOOOO')
                  musicPlayer.curTrackObject.seek(50000);
                }

                // console.log(track.connection+":\n  Time update: "+currentTime + " "+duration);
              },
              onended: function() {
                var params = queryString();

                var currVote = handleList.SONG_LIST[0].votecount;
                var id = handleList.SONG_LIST[0].songid;                
                handleList.SONG_LIST[0].votecount = 0;

                $.ajax({ 
                  beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                  },          
                  type : 'POST', 
                  url : "/api/changeVote/", 
                  data : { 
                    'playlist' : params.playlist,
                    'songid' : id,
                    'delta' : -currVote                  
                  },
                  success: function(response) { 
                    console.log("found playlist");
                    temp = JSON.parse(response);

                  },
                  error: function(e, x, r) { 
                    console.log("error - could not change vote");
                  }
                });

                $("#playlist").empty();
                handleList.showList(handleList.SONG_LIST);

                musicPlayer.curTrackObject = musicPlayer.createTrackObject(handleList.SONG_LIST[0]);
                $("#playlist_video_area").empty().append(musicPlayer.curTrackObject.render());
              },
              onpause: function() {
              // only allow pausing via pause all button
                if (musicPlayer.setPaused == false) {
                  musicPlayer.curTrackObject.play();
                }
              },
              onplay: function() {
                // only allow playing via play all button
                if (musicPlayer.setPlaying == false) {
                  musicPlayer.setPaused = true;
                  musicPlayer.curTrackObject.pause();
                }

                var t = setTimeout(function() {
                  track.seek(200000);
                }, 5000);

              }
            }
        });
return track
}
}( window.musicPlayer = window.musicPlayer || {}, jQuery ));