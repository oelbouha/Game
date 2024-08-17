from . import views
from django.urls import path
from django.shortcuts import render
from django.http import HttpResponse

def game(request):
	# print the request object in the console error log

	# set the content type of the response
	return render(request, 'index.html')


urlpatterns = [
	path('', game)
]