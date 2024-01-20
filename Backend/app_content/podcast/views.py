# podcast_app/views.py
import logging
import requests
import feedparser
from django.core.cache import cache
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from urllib.parse import urlencode

logger = logging.getLogger(__name__)

class PodcastsView(APIView):
    def get(self, request):
        podcast_name = request.query_params.get(
            "podcastName", "tea-time-unfiltered-with-lovelyti"
        )
        cache_key = f"podcastInfo:{podcast_name}"
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        podcast_info = self.fetch_and_save_podcast_info(podcast_name, cache_key)
        if podcast_info:
            return Response(podcast_info)
        return Response(
            {"error": f'Error fetching podcast information for "{podcast_name}".'},
            status=500,
        )

    def get_podcast_feed_url(self, podcast_name):
        search_term = urlencode({"term": podcast_name})
        itunes_api_url = f"https://itunes.apple.com/search?media=podcast&{search_term}"

        response = requests.get(itunes_api_url)
        data = response.json()

        if data["results"]:
            return data["results"][0]["feedUrl"]
        raise ValueError("Podcast not found in iTunes Search API.")

    def fetch_and_save_podcast_info(self, podcast_name, cache_key):
        try:
            feed_url = self.get_podcast_feed_url(podcast_name)
            feed = feedparser.parse(feed_url)

            podcast_info = {
                "title": feed["feed"]["title"],
                "podcastUrl": feed["feed"]["link"],
                "episodes": [
                    {
                        "title": item["title"],
                        "audioUrl": item.get("enclosures", [{}])[0].get("href"),
                        "permalink": item["link"],
                        "featured_src": feed["feed"].get("image", {}).get("href"),
                    }
                    for item in feed["entries"][:15]
                ],
            }
            # Optionally save to a database or cache
            logger.info(f"Saving podcast information to cache: {cache_key} for 6 hours.")
            cache.set(cache_key, podcast_info, 21600)  # Cache for 6 hours

            return podcast_info
        except Exception as e:
            print(f"Error fetching and saving podcast information: {str(e)}")
            logger.exception(e)
            return None
