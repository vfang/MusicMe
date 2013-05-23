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
		template = loader.get_template('playlist/intro.html')

		return render_to_response('playlist/intro.html', context, context_instance=RequestContext(request))

	playlist = get_object_or_404(Playlist, pk=pid)
	SONGS = []

	songs = Song.objects.all().filter(playlist=pid)

	for song in songs:
		SONGS.append(song)
	print SONGS

	currentSongList = make_song_json_list(SONGS)
	print currentSongList
	context = Context({'song_list': currentSongList, 'pid': pid, 'playlistName' : playlist.name })	

	return render_to_response('playlist/index.html', context, context_instance=RequestContext(request))

def addSong(request):
	pid = request.POST['playlist']
	songInfo = request.POST['songsearch']

	print songInfo, pid

	songInfo = re.split(', ', songInfo)
	songTitle = songInfo[0]
	songArtist = songInfo[1]

	print songInfo
	print songTitle
	print songArtist

	key=hashlib.sha256((songTitle+songArtist).encode('utf-8')).hexdigest()
	print key
	# FIX - check for existing songs with artist/title before creating
	song, created = Song.objects.get_or_create(artist=songArtist, title=songTitle, songid=key, playlist_id=pid)
	print created
	if created:
		
		song.save()
		print 'saved'
		print 'TRACK: ',songTitle, ' by ', songArtist, ' saved'	
		# playlist = Playlist.objects.get(id = pid)
		# playlist.songs.add(song.id)

	else:
		print 'TRACK: ',songTitle, ' by ', songArtist, ' already exists'
	return HttpResponse(json.dumps({'message': 'success'}))



def getPlaylist(request):
	pid = request.GET.get('playlist')

	songs = []

	for song in Song.objects.all().filter(playlist=pid):
		songs.append(song.writeToJSON())


	return HttpResponse(json.dumps(songs), content_type="application/json")

def updateVotes(request):
	pid = request.POST.get('playlist')
	sid = request.POST.get('songid')
	vid = request.POST.get('vote')


def addPlaylist(request):
	playlistName = request.POST['playlistName']

	print 'adding playlist'

	if Playlist.objects.filter(name=playlistName):
		print 'Playlist exists'
	else:
		Playlist.objects.create(name=playlistName)

	playlist = Playlist.objects.get(name=playlistName)
	pid = playlist.id

	print pid

	return HttpResponseRedirect("/?playlist="+str(pid))

def verifyPlaylist(request):
	playlistName = request.POST['goToPlaylist']
	print playlistName

	if Playlist.objects.filter(name=playlistName):
		playlist = Playlist.objects.get(name=playlistName)
		pid = playlist.id

		return HttpResponse(json.dumps({'message': 'success', 'pid' : pid}))
	else:
		print 'Playlist does not exist'
		context = Context({ 'error' : True, 'playlistName' : playlistName })
		return HttpResponse(json.dumps({'message': 'error'}))

def changeVote(request):

	pid = request.POST.get('playlist')
	sid = request.POST.get('songid')
	votes = request.POST.get('delta')

	songs = Song.objects.all().filter(playlist=pid, songid=sid)
	for song in songs:
		song.votecount = song.votecount + int(votes)
		song.save()

	return HttpResponse(json.dumps({'message': 'success', 'pid' : pid}))
	