from django.urls import path

from app_content.podcast.views import PodcastsView
from app_content.gif.views import TrendingGIFsView, SearchGIFsView
from app_content.youtube.views import YouTubeVideosView

urlpatterns = [
    path("videos/", YouTubeVideosView.as_view(), name="video-list"),
    path("podcasts/", PodcastsView.as_view(), name="podcast-list"),
    path("trending/", TrendingGIFsView.as_view(), name="trending_gifs"),
    path("search/", SearchGIFsView.as_view(), name="search_gifs"),
]
