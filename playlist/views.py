from django.http import HttpResponse
from django.template import Context, loader

def index(request):
   	context = Context({})
	template = loader.get_template('playlist/index.html')
	
	return HttpResponse(template.render(context))    