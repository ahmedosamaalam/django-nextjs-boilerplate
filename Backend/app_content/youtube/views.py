# youtube_app/views.py
import logging
from django.conf import settings
from django.core.cache import cache
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from html import unescape

logger = logging.getLogger(__name__)

class YouTubeVideosView(APIView):
    def get(self, request):
        query = request.query_params.get('query', '')
        cache_key = f'videos:{query}'
        cached_videos = cache.get(cache_key)

        if cached_videos:
            return Response(cached_videos)

        videos = self.fetch_youtube_videos(query)
        if videos is not None:
            logger.info(f"Saving videos information to cache: {cache_key} for 6 hours.")
            cache.set(cache_key, videos, 21600)  # Cache for 6 hours
            return Response(videos)
        return Response({'error': 'Error fetching YouTube videos'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def fetch_youtube_videos(self, query):
        url = f'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCQzzrNOmf-xduT_1_c-Mrrw&order=date&q={query}&maxResults=50&key={settings.YOUTUBE_API_KEY}'
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return [
                {
                    'id': item['id']['videoId'],
                    'title': unescape(item['snippet']['title']),
                    'description': item['snippet']['description'],
                    'permalink': f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    'featured_src': item['snippet']['thumbnails']['high']['url']
                } for item in data['items']
            ]
        else:
            logger.error(f'Error fetching YouTube videos: {response.status_code} - {response.text}')
            return None
