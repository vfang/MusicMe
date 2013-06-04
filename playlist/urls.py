from django.conf.urls import patterns, url
import random, string

from playlist import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^api/getPlaylist/$', views.getPlaylist),
    url(r'^api/addSong/$', views.addSong),
    url(r'^api/addPlaylist/$', views.addPlaylist),
    url(r'^api/verifyPlaylist/$', views.verifyPlaylist),
	url(r'^api/changeVote/$', views.changeVote),
	url(r'^api/deleteSong/$', views.deleteSong),

)