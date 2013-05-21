from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response
from playlist.models import Song, Playlist
from playlist.utils import *

import re
import hashlib

import json

def index(request):
	pid = request.GET.get('playlist')

	if (pid is None):
		context = Context()
		template = loader.get_template('playlist/index.html')

		return render_to_response('playlist/index.html', context, context_instance=RequestContext(request))

	if request.method == "POST":
		try:
			songInfo = request.POST['songsearch']
			print songInfo, pid

			songInfo = re.split(', ', songInfo)
			songTitle = songInfo[0]
			songArtist = songInfo[1]

			key=hashlib.sha256((songTitle+songArtist).encode('utf-8')).hexdigest()
			song, created = Song.objects.get_or_create(artist=songArtist, title=songTitle, songid=key)
			if created:
				
				song.save()
				print 'TRACK: ',songTitle, ' by ', songArtist, ' saved'	
				playlist = Playlist.objects.get(id = pid)
				playlist.songs.add(song.id)
			else:
				print 'TRACK: ',songTitle, ' by ', songArtist, ' already exists'
			return HttpResponse(json.dumps({'message': 'success'}))
		except:
			print "failed to post request"

	playlist = get_object_or_404(Playlist, pk=pid)
	SONGS = []

	for song in playlist.songs.all():
		SONGS.append(song)
	print SONGS

	currentSongList = make_song_json_list(SONGS)
	print currentSongList
	context = Context({'song_list': currentSongList, 'pid': pid})
	template = loader.get_template('playlist/index.html')

	return render_to_response('playlist/index.html', context, context_instance=RequestContext(request))

def getPlaylist(request):
	pid = request.GET.get('playlist')

	playlist = get_object_or_404(Playlist, pk=pid)

	songs = []

	for song in playlist.songs.all():
		songs.append(song.writeToJSON())


	return HttpResponse(json.dumps(songs), content_type="application/json")




