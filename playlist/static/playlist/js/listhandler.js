$.getScript("static/playlist/js/cookiejar.js");

$.getScript("static/playlist/js/musicme.js");

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
        return false;
      }

      handleList.colorButtons = function() {
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
      }

      handleList.showList = function(list) {

        console.log("start showlist");
        console.log(list);
        console.log("end showlist");

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
        handleList.colorButtons();
        // event handler for click on upvote button
        $('.upvotebutton').click(function(e) {
          console.log("upvotebutton clicked.");
          e.preventDefault;
          var prefix = "up_";
          var id = $(this).attr('id').substring(prefix.length);
          handleList.changeVote(1,id);

          voteCookie.toggleSongVoteStatus(id,1);
          console.log("toggled vote status");
          return false;
        });

        $('.downvotebutton').click(function(e) {
          e.preventDefault;
          var prefix = "down_";
          var id = $(this).attr('id').substring(prefix.length);
          handleList.changeVote(-1,id);

          voteCookie.toggleSongVoteStatus(id,-1);
          return false;
        })

      };
  }( window.handleList = window.handleList || {}, jQuery ));