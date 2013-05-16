from django.contrib import admin
from playlist.models import Song, Playlist

# class SongAdmin(admin.ModelAdmin):
    # fields =['artist']

admin.site.register(Song)
admin.site.register(Playlist)