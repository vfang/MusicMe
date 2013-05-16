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
	# return HttpResponse(template.render(context),context_instance=RequestContext(request))

def add(request):
	pid = request.GET.get('playlist')
	print pid

	try:
		songInfo = request.POST['songsearch']
		print songInfo
		# print playlisturl

		songInfo = re.split(', ', songInfo)
		songTitle = songInfo[0]
		songArtist = songInfo[1]

		print 'TRACK: ',songTitle, ' by ', songArtist

		key=hashlib.sha256((songTitle+songArtist).encode('utf-8')).hexdigest()
		song, created = Song.objects.get_or_create(artist=songArtist, title=songTitle, songid=key)
		if created:
			print 'saved'
			song.save()
			playlist = Playlist.objects.get(id = pid)
			playlist.songs.add(song.id)
		else:
			
			print 'TRACK: ',songTitle, ' by ', songArtist, ' already exists'
			
	except:
		return HttpResponseRedirect("../")
	context = Context()
	template = loader.get_template('playlist/index.html')

	# return render_to_response('/?playlist=' + pid, context, context_instance=RequestContext(request))	
	return HttpResponseRedirect(request.META.get('HTTP_REFERER','/?playlist=' + pid))
