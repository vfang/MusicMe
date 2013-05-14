from django.db import models

import hashlib

## Container object for a song
class SongContainer(models.Model):
	title = models.CharField(max_length=200)
	artist = models.CharField(max_length=200)
	albumTitle = models.CharField(max_length=200)
	albumArtUrl = models.CharField(max_length=500)
	votecount = models.IntegerField(default=0)
	downcount = models.IntegerField(default=0)
	upcount = models.IntegerField(default=0)

	songid = models.CharField(max_length=200)

	upbtndisable = models.BooleanField(default=False)
	downbtndisable = models.BooleanField(default=False)

	created_at = models.DateTimeField(auto_now_add=True)


	def __init__(self,title,artist,album,votecount=0):
		self.title = title
		self.artist = artist
		self.album = album		
		self.votecount = votecount
		# unique 160-bit id
		self.songid = hashlib.sha256((title+artist).encode('utf-8')).hexdigest()
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
