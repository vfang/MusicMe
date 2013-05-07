from django.db import models

## Container object for a song
class SongContainer:
	def __init__(self,title,artist,votecount=0):
		self.title = title
		self.artist = artist
		self.votecount = votecount
	## return a JSON representation of this object
	def writeToJSON(self):
		json = {}
		json["songtitle"] = self.title
		json["artist"] = self.artist
		json["votecount"] = self.votecount
		return json

	def updateVoteCount(delta): 
		self.votecount += delta
		return

