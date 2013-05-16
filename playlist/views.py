from django.http import HttpResponse
from django.template import Context, loader

from playlist.models import SongContainer
from playlist.utils import *

import json

def index(request):
	
	# should get this from db, obviously
	SONGS = [SongContainer("Mirrors","Justin Timberlake",10),
			 SongContainer("Stay","Rihanna",20),
			 SongContainer("Example 3","Moritz",21)]
	currentSongList = make_song_json_list(SONGS)
	context = Context({'song_list': currentSongList})
	template = loader.get_template('playlist/index.html')

	return HttpResponse(template.render(context))    