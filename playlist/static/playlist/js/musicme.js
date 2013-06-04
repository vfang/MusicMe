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

//Resizing for mobile
 window.onresize = function(event) {
//   //searchWidth = $("#search").css("width");
//   //$('.searchResultContainer').css("width", searchWidth);  

//   //winHeight = $(window).height();
//   //maxHeight = 672;

//   var isIpad = /iPad/i.test(navigator.userAgent);

   if ($(window).width() <= "768" || /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
      console.log('mobile');
      $('#playPlaylistBtn').css('font-size', '.9em');
      $('#pausePlaylistBtn').css('font-size', '.9em');
      $('#clickedEnter').css('font-size', '.9em');
      $('#songsearch').css('font-size', '.9em');
   }else
   {     
      $('#playPlaylistBtn').css('font-size', '1.25em');
      $('#pausePlaylistBtn').css('font-size', '1.25em');
      $('#clickedEnter').css('font-size', '1.25em');
      $('#songsearch').css('font-size', '1.25em');
   }

//   }


 }
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

        // Prevent default for 'enter'
        $('#addSong').keypress(function(event){
          if (event.keyCode == 13) {
            // console.log('preventing default for enter');
            event.preventDefault();

            console.log('logging: ' + $('.searchResultContainer').children()[0].innerHTML);
            var str = $('.searchResultContainer').children()[0].innerHTML;

            current_song = str.match(/<b>(.*?)<\/b>/)[1]
            current_artist = str.match(/<artist>(.*?)<\/artist>/)[1]

            $("#enterbutton").click();
            $('.searchResult').remove();
            $('#songsearch').val('');

          }
        });


        $('#addSong').submit(function(e) {     
          console.log('hihihi');    

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
      musicPlayer.setPlaying = true;
      musicPlayer.curTrackObject.play();

    });


    $('#pausePlaylistBtn').click(function() {
      musicPlayer.setPaused = true;
      musicPlayer.setPlaying = false;
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
        if ((event.keyCode >= 48 && event.keyCode <= 122) || event.keyCode == 8) {
          var query = $('#songsearch').val();

          if (query == ''){
          $('.searchResult').remove();
        } else{
            lastfm.track.search({track: query, limit: 15}, {success: function(data){
              //console.log(data);
              $('.searchResult').remove();
              
              for(var song in data.results.trackmatches.track){
                //console.log('Song ::: ' + song);
                var matchingSong = document.createElement('div');
                matchingSong.className = "searchResult";
                matchingSong.innerHTML += '<b> '+data.results.trackmatches.track[song].name+'</b>, <artist>'+data.results.trackmatches.track[song].artist+"</artist>";

                $(matchingSong).data("title", data.results.trackmatches.track[song].name);
                $(matchingSong).data("artist", data.results.trackmatches.track[song].artist);

                $('.searchResultContainer').append(matchingSong);

                // add class to search result list
                //var key = data.results.trackmatches.track[song].name + ', ' + data.results.trackmatches.track[song].artist;
                //SEARCH_RESULT_LIST[key] = data.results.trackmatches.track[song];
              }

              $('.searchResult').click(function() {
                console.log('logging: ' + $(this));

                current_song = $(this).data("title");
                current_artist = $(this).data("artist");

                $("#enterbutton").click();

                // $("#songsearch").val($(this).text());
                //Functionality for Searching for song.
                $('.searchResult').remove();

                $('#songsearch').val('');
              });

              $("#clickedEnter").click(function() {
                console.log('logging: ' + $('.searchResultContainer').children()[0].innerHTML);
                var str = $('.searchResultContainer').children()[0].innerHTML;

                current_song = str.match(/<b>(.*?)<\/b>/)[1]
                current_artist = str.match(/<artist>(.*?)<\/artist>/)[1]

                $("#enterbutton").click();

                $('.searchResult').remove();

                $('#songsearch').val('');


              });


              $('#search').focus(function() {
               $('.searchResultContainer').show();
              }); 

          }})}

        }    

      },
      doneTypingInterval
      );
  }); 

  });
