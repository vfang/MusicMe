var current_artist;
var current_song;

var votes = new Object();

function createUpvoteBtn(ele) {
  return "<div class='upvotebuttonContainer'><button type='button' class='tiny button radius upvotebutton' style='background-color: gray; border: gray;' id='up_" + ele.songid + "'>&#x25B2;</button></div>";
}

function createPlaylistElement(ele){
  var html = "<div class='panel songpanel'>" /*+ createPlayBtn(ele)*/ + "<div id='songInf'>" + ele.songtitle + " - " + ele.artist + "</div>" + "<div id='voteContainer'>" + createUpvoteBtn(ele)+ createDownBtn(ele) + "<div id='votes'>" + ele.votecount + " </div>" + "</div>" + "</div>";
  
  return html; 
}

//function createPlayBtn(ele) {
//  var html = "<button class='small button playButton' id='play_" + ele.songid + "'>PLAY</button>";
//  return html;
//}

function clearList() {
  $('#playlist').empty();
}

function createDownBtn(ele){
  return "<div class='downvotebuttonContainer'><button type='button' class='tiny button radius downvotebutton' style='background-color: gray; border: gray;' id='down_" + ele.songid + "'>&#x25BC;</button></div>";
}

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


      // TODO: change votecount on backend
      handleList.changeVote = function(delta,id) { 
        for (var i in handleList.SONG_LIST) {
          if (handleList.SONG_LIST[i].songid == id) {
             var params = queryString();

            if (delta > 0) {
              if (handleList.SONG_LIST[i].upbtndisable == "False"){
                if(handleList.SONG_LIST[i].downbtndisable == "True"){
                  handleList.SONG_LIST[i].votecount += delta*2;
                  delta = 2;
                  handleList.SONG_LIST[i].upbtndisable = "True";
                  handleList.SONG_LIST[i].downbtndisable = "False";
                }
                else{
                  handleList.SONG_LIST[i].votecount += delta;
                  handleList.SONG_LIST[i].upbtndisable = "True";
                } 
              }
              else{
                handleList.SONG_LIST[i].votecount -= delta;
                handleList.SONG_LIST[i].upbtndisable = "False";
                delta = -1;
              }
            }
            else {
              if (handleList.SONG_LIST[i].downbtndisable == "False"){
                if (handleList.SONG_LIST[i].upbtndisable == "True") {
                    handleList.SONG_LIST[i].votecount += delta*2;
                    delta = -2;
                   handleList.SONG_LIST[i].downbtndisable = "True";
                   handleList.SONG_LIST[i].upbtndisable = "False";
                }
                else{
                  handleList.SONG_LIST[i].votecount += delta;
                  handleList.SONG_LIST[i].downbtndisable = "True";
                }
              }
              else{
                handleList.SONG_LIST[i].votecount -= delta;
                handleList.SONG_LIST[i].downbtndisable = "False";
                delta = 1;
              }
            }

             $.ajax({ 
              beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
              },          
              type : 'POST', 
              url : "/api/changeVote/", 
              data : { 
                  'playlist' : params.playlist,
                  'songid' : id,
                  'delta' : delta                  
                },
                success: function(response) { 
                  console.log("found playlist");
                  temp = JSON.parse(response);
                         
                },
                error: function(e, x, r) { 
                  console.log("error - could not change vote");
                }
              });


          }
        }

        clearList();
        handleList.showList(handleList.SONG_LIST);
        // loop through the list to see which song has been down voted and up voted, and disable that btn
        for (var i in handleList.SONG_LIST) {
          if (handleList.SONG_LIST[i].upbtndisable == "True") {
            // document.getElementById('down_'+handleList.SONG_LIST[i].songid).disabled = true;
            $('#up_'+handleList.SONG_LIST[i].songid).css("background-color", "#5da423");
          }
          if(handleList.SONG_LIST[i].downbtndisable == "True"){
            // document.getElementById('up_'+handleList.SONG_LIST[i].songid).disabled = true;
            $('#down_'+handleList.SONG_LIST[i].songid).css("background-color", "#c60f13"); 
          } 
        }
        return false;
      }

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

        $('#playlist').append(html);
        // event handler for click on upvote button
        $('.upvotebutton').click(function(e) {
          e.preventDefault;
          var prefix = "up_";
          var id = $(this).attr('id').substring(prefix.length);
          handleList.changeVote(1,id);
          return false;
        });

        $('.downvotebutton').click(function(e) {
          e.preventDefault;
          var prefix = "down_";
          var id = $(this).attr('id').substring(prefix.length);
          handleList.changeVote(-1,id);
          return false;
        })

      };
  }( window.handleList = window.handleList || {}, jQuery ));

function queryString () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
      // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
  return query_string;
};

// using jQuery
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
            }
          }
        }
        return cookieValue;
      }

      var csrftoken = getCookie('csrftoken');


      $(document).ready(function() {
        var params = queryString();


        $('#addSong').submit(function(e) {

         $.ajax({ 
          beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          },          
          type : 'POST', 
          url : "/api/addSong/", 
          data : { 
            'playlist' : params.playlist,
              'songsearch_artist' : current_artist,
              'songsearch_song' : current_song,
              // $("#songsearch").val() //$(this).serialize(),
            },

            success: function(response) {
              temp = JSON.parse(response);

              if(temp["message"] == "error - duplicate entry") {
                console.log("ERROR: Entry already exists");
                $('#addedSongNotifError').fadeTo('slow', 1);
                   var t = setTimeout(function() {
                    $('#addedSongNotifError').fadeTo('slow', 0);
                    var f = setTimeout(function() {
                      $('#addedSongNotifError').css("display", "none");
                    }, 500);
                  },3000);

              }
              else { 
                console.log("added song");
                $.getJSON(
                  '/api/getPlaylist/?playlist=' + params.playlist, 
                  function(data) { 
                    if(handleList.SONG_LIST){                
                      handleList.SONG_LIST.push(data[data.length -1]);                 
                      clearList(); 
                      handleList.showList(handleList.SONG_LIST);
                    } else {
                      var tempList = data[data.length -1];
                      handleList.showList(tempList);
                    }

                   $('#addedSongNotif').fadeTo('slow', 1);
                   var t = setTimeout(function() {
                    $('#addedSongNotif').fadeTo('slow', 0);
                    var f = setTimeout(function() {
                      $('#addedSongNotif').css("display", "none");
                    }, 500);
                  },3000);


                  });
              }

            },
            error: function(e, x, r) { 
              console.log("error - could not add song");
            }
          });                 

         return false;
       });
      
      $('#goToPlaylist').submit(function(e) {
        console.log($("#goToPlaylists").val());
        console.log(e);
        //  $('#addedSongNotif').fadeTo('slow', 1);
        //  var t = setTimeout(function() {
        //   $('#addedSongNotif').fadeTo('slow', 0);
        //   var f = setTimeout(function() {
        //     $('#addedSongNotif').css("display", "none");
        //   }, 500);
        // },3000);

         $.ajax({ 
          beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
          },          
          type : 'POST', 
          url : "/api/verifyPlaylist/", 
          data : { 
              'goToPlaylist' : $("#goToPlaylists").val() //$(this).serialize(),
            },
            success: function(response) { 
              console.log("found playlist");
              temp = JSON.parse(response);

              if(temp["message"] == "error") {
                console.log('playlist does not exist');
                $('#playlistError').fadeTo('slow', 1);
               var t = setTimeout(function() {
                $('#playlistError').fadeTo('slow', 0);
                var f = setTimeout(function() {
                  $('#playlistError').css("display", "none");
                }, 500);
              },3000);
              }
              else {
              pid = temp["pid"];
              window.location.href = '/?playlist='+pid;
              }                          
            },
            error: function(e, x, r) { 
              console.log("error - could not add song");
            }
          });                 

         return false;
       });

    var tid= setInterval(mycode, 5000);

    function mycode() {
      $.ajax({
        url: "/api/getPlaylist/?playlist=" + params.playlist

      }).done(function(response) {
        console.log(response);
      });
    }
    function abortTimer () {
      clearInterval(tid);
    }

    $('#playPlaylistBtn').click(function() {

      musicPlayer.setPaused = false;

      $(this).css("display","none");
      $("#pausePlaylistBtn").css("display","block");

      console.log(musicPlayer);

      if (musicPlayer.setStarted == false) {
        musicPlayer.setStarted = true;
        musicPlayer.curTrackObject = musicPlayer.createTrackObject(handleList.SONG_LIST[0]);
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

var SEARCH_RESULT_LIST = {};
var SEARCH_LIST_FROM_NUM = {};

$(document).ready(function() {
      //// LASTFM search stuff ////
  /* Create a cache object */
  var cache = new LastFMCache();

  /* Create a LastFM object */
  var lastfm = new LastFM({
    apiKey    : 'cdafc0e03ea8b9eee8bb7f5a3708c5ac',
    apiSecret : '338fa6de0fd1c2de4093134ea75c75ca',
    cache     : cache
  });

  /*lastfm.artist.search({artist: /*input}, {success: function(data){
    //If we want to have an artist search.
    //Populate the autosearch here.
  }})*/
  var typingTimer;
  var doneTypingInterval = 200;

  

  $("#songsearch").keyup(function(event) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(
      function() {
        if(event.keyCode == 13) { $("#enterbutton").click(); }
        else if ((event.keyCode >= 48 && event.keyCode <= 122) || event.keyCode == 8) {
          var query = $('#songsearch').val();

          lastfm.track.search({track: query, limit: 15}, {success: function(data){
            //console.log(data);
            $('.searchResult').remove();
            
            for(var song in data.results.trackmatches.track){
              //console.log('Song ::: ' + song);
              var matchingSong = document.createElement('div');
              matchingSong.className = "searchResult";
              matchingSong.innerHTML += '<b> '+data.results.trackmatches.track[song].name+'</b>, '+data.results.trackmatches.track[song].artist;

              $(matchingSong).data("title", data.results.trackmatches.track[song].name);
              $(matchingSong).data("artist", data.results.trackmatches.track[song].artist);

              $('.searchResultContainer').append(matchingSong);

              // add class to search result list
              //var key = data.results.trackmatches.track[song].name + ', ' + data.results.trackmatches.track[song].artist;
              //SEARCH_RESULT_LIST[key] = data.results.trackmatches.track[song];
            }

            $('.searchResult').click(function() {
              console.log($(this).text());

              current_song = $(this).data("title");
              current_artist = $(this).data("artist");

              $("#enterbutton").click();

              // $("#songsearch").val($(this).text());
              //Functionality for Searching for song.
              $('.searchResult').remove();
            });

            searchWidth = $("#songsearch").css("width");
            $('.searchResultContainer').css("width", searchWidth);

            $('#search').focus(function() {
             $('.searchResultContainer').show();
            }); 

          }})

        }
      },
      doneTypingInterval
      );
  }); 



  });
