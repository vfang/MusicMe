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

                // console.log(track.connection+":\n  Time update: "+currentTime + " "+duration);
              },
              onended: function() {
                handleList.SONG_LIST[0].votecount = 0;
                $("#playlist").empty();
                handleList.showList(handleList.SONG_LIST);

                musicPlayer.curTrackObject = musicPlayer.createTrackObject(handleList.SONG_LIST[0]);
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