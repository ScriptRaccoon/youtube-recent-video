# How to Display Recent YouTube Video on a SvelteKit Page

This project demonstrates how to display the most recent YouTube video from your channel on a SvelteKit page. The code will be used for a tutorial on my YouTube channel.

The data is fetched using the YouTube Data API, which requires an API key (see instructions below).

To reduce the number of requests to the API, the video details are cached in a Redis instance. You can host a free Redis instance on <https://upstash.com/>.

I use this method on my portfolio page to display the latest video: <https://scriptraccoon.dev/youtube>

## How to Get an API Key

1. Visit <https://console.cloud.google.com/>.
2. Create a new project and switch to it.
3. Go to APIs & Services > Library and search for the YouTube Data API v3.
4. Enable the API.
5. Go to Credentials and click "Create Credentials".
6. Select "API key".
7. Copy the key to the `.env` file.
