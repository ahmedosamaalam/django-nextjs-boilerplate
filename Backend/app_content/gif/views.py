import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from django.core.cache import cache
import requests
from rest_framework import status

from app_content.utils import extract_gif_data

logger = logging.getLogger(__name__)

API_KEYS = {
    'android': settings.GIPHY_ANDROID,
    'ios': settings.GIPHY_IOS,
}

class SearchGIFsView(APIView):
    def get(self, request):
        keyword = request.query_params.get("q")
        platform = request.query_params.get("platform", "")
        api_key = API_KEYS.get(platform, settings.GIPHY_WEB)

        if not keyword:
            logger.error("Keyword is required")
            return Response(
                {"error": "Keyword is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        cache_key = f"searchGifs:{keyword}"
        cached_gifs = cache.get(cache_key)
        if cached_gifs:
            return Response(cached_gifs)

        response = requests.get(
            f"https://api.giphy.com/v1/gifs/search?q={keyword}&api_key={api_key}&limit=30"
        )
        if response.status_code == 200:
            gifs = response.json()["data"]
            extracted_gifs = [extract_gif_data(gif) for gif in gifs]
            logger.info(f"Saving GIFs information to cache: {cache_key} for 1.5 hours.")
            cache.set(cache_key, extracted_gifs, 5400)  # Cache for 1.5 hours
            return Response(extracted_gifs)
        return Response(
            {"error": f'Error fetching search results for "{keyword}"'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

class TrendingGIFsView(APIView):
    def get(self, request):
        platform = request.query_params.get('platform', '')
        api_key = API_KEYS.get(platform, settings.GIPHY_WEB)

        cached_gifs = cache.get('trendingGifs')
        logger.info(f"Fetching trending GIFs from cache: trendingGifs")
        if cached_gifs:
            return Response(cached_gifs)

        response = requests.get(f'https://api.giphy.com/v1/gifs/trending?api_key={api_key}&limit=50')
        if response.status_code == 200:
            gifs = response.json()['data']
            extracted_gifs = [extract_gif_data(gif) for gif in gifs]
            logger.info(f"Trending GIFs information to cache: trendingGifs for 1.5 hours.")
            cache.set('trendingGifs', extracted_gifs, 86400)  # Cache for 24 hours
            return Response(extracted_gifs)
        return Response({'error': 'Error fetching GIFs'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    