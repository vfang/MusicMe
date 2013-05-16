from django.contrib import admin
from playlist.models import SongContainer

# class SongAdmin(admin.ModelAdmin):
    # fields =['artist']

admin.site.register(SongContainer)