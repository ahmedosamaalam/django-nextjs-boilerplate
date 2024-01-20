def extract_gif_data(gif):
        return {
            'id': gif.get('id'),
            'title': gif.get('title'),
            'url': gif.get('images', {}).get('original', {}).get('url')
        }