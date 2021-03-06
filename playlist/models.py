from django.db import models

import hashlib


class Playlist(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=200)
	# songs = models.ForeignKey(Song)
	# songs = models.OneToManyField(Song)

	def __unicode__(self):
		return u'%s' % (self.name)

## Container object for a song
class Song(models.Model):

	playlist = models.ForeignKey(Playlist)

	title = models.CharField(max_length=200)
	artist = models.CharField(max_length=200)
	albumTitle = models.CharField(max_length=200)
	albumArtUrl = models.CharField(max_length=500)
	votecount = models.IntegerField(default=0)
	downcount = models.IntegerField(default=0)
	upcount = models.IntegerField(default=0)

	songid = models.CharField(max_length=1000)

	upbtndisable = models.BooleanField(default=False)
	downbtndisable = models.BooleanField(default=False)

	created_at = models.DateTimeField(auto_now_add=True)


	# def __init__(self,title,artist,album,votecount=0):
	# 	self.title = title
	# 	self.artist = artist
	# 	self.album = album		
	# 	self.votecount = votecount
	# 	# unique 160-bit id
	# 	self.songid = hashlib.sha256((title+artist).encode('utf-8')).hexdigest()
	# 	self.upbtndisable = "enable"
	# 	self.downbtndisable = "enable"
	# ## return a JSON representation of this object
	def writeToJSON(self):
		json = {}
		json["songtitle"] = str(self.title)
		json["artist"] = str(self.artist)
		json["votecount"] = self.votecount
		json["songid"] = str(self.songid)
		# a new variable to disable the up down btn
		json["upbtndisable"] = str(self.upbtndisable)
		json["downbtndisable"] = str(self.downbtndisable)
		return json

	def updateVoteCount(delta): 
		self.votecount += delta
		return

	def __unicode__(self):
		return u'%s - %s' % (self.title, self.artist)

