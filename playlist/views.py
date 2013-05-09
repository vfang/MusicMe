from django.http import HttpResponse
from django.template import Context, loader

from playlist.models import SongContainer
from playlist.utils import *

import json

def index(request):

	# should get this from db, obviously
	SONGS = [SongContainer("Example 1","Corey",10),SongContainer("Example 2","Vanessa",20),SongContainer("Example 3","Moritz",10000)]
	currentSongList = make_song_json_list(SONGS)
	context = Context({'song_list': currentSongList})
	template = loader.get_template('playlist/index.html')

	return HttpResponse(template.render(context))    