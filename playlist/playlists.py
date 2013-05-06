## classes and functions for defining and managing song objects and lists

DEBUG_PLAYLISTS_PY = False

# ## Container object for a song
# class SongContainer:
# 	def __init__(self,title,artist,votecount=0):
# 		self.title = title
# 		self.artist = artist
# 		self.votecount = votecount
# 	## return a JSON representation of this object
# 	def writeToJSON(self):
# 		json = {}
# 		json["title"] = self.title
# 		json["artist"] = self.artist
# 		json["votecount"] = self.votecount
# 		return json

# 	def updateVoteCount(delta): 
# 		self.votecount += delta
# 		return


## take as input an unordered array of SongContainer objects, and return a list of JSON song objects sorted by descending upvote count
def make_song_json_list(song_arr):
	# sort so the highest vote count is first
	song_arr.sort(key=lambda songcontainer: -songcontainer.votecount)
	# do things here
	json_arr = []
	for song in song_arr:
		json_arr.append(song.writeToJSON())
	return json_arr

## testing
if __name__ == "__main__":
	if DEBUG_PLAYLISTS_PY == True:
		songlist = []
		songlist.append(SongContainer("Call Me Maybe","Carly Rae Jepsen",-10))
		songlist.append(SongContainer("The World Is Yours","Nas",20))
		songlist.append(SongContainer("Help!","The Beatles",10))
		songlist.append(SongContainer("The End","The Doors",100))
		print make_song_json_list(songlist)