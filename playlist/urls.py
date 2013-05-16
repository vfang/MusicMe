from django.conf.urls import patterns, url
import random, string

from playlist import views

uniquecode = ''.join(random.choice(string.ascii_lowercase + string.digits + string.ascii_uppercase) for x in range(8))


urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),    
)