from django.http import HttpResponse
from django.template import Context, loader
from django.shortcuts import render, get_object_or_404

from playlist.models import Song, Playlist
from playlist.utils import *

import json

def index(request):
	pid = request.GET.get('playlist')

	if (pid is None):
		context = Context()
		template = loader.get_template('playlist/index.html')

		return HttpResponse(template.render(context))    		

	playlist = get_object_or_404(Playlist, pk=pid)
	SONGS = []

	for song in playlist.songs.all():
		SONGS.append(song)
	print SONGS

	currentSongList = make_song_json_list(SONGS)
	print currentSongList
	context = Context({'song_list': currentSongList})
	template = loader.get_template('playlist/index.html')

	return HttpResponse(template.render(context))