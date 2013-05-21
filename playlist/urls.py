from django.conf.urls import patterns, url
import random, string

from playlist import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^api/getPlaylist/$', views.getPlaylist),
    url(r'^api/addSong/$', views.addSong),

)