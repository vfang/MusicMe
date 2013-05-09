from django.db import models

import hashlib

## Container object for a song
class SongContainer:
	def __init__(self,title,artist,votecount=0):
		self.title = title
		self.artist = artist
		self.votecount = votecount
		# unique 160-bit id
		self.songid = hashlib.sha256(title.encode('utf-8')).hexdigest()
		self.upbtndisable = "enable"
		self.downbtndisable = "enable"
	## return a JSON representation of this object
	def writeToJSON(self):
		json = {}
		json["songtitle"] = self.title
		json["artist"] = self.artist
		json["votecount"] = self.votecount
		json["songid"] = self.songid
		# a new variable to disable the up down btn
		json["upbtndisable"] = self.upbtndisable
		json["downbtndisable"] = self.downbtndisable
		return json

	def updateVoteCount(delta): 
		self.votecount += delta
		return

