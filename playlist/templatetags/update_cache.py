from django import template

register = template.Library()

def update_votes(value):
	
	return value

register.filter("update_votes",update_votes)