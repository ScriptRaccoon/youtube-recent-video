# Displaying the Most Recent YouTube Video on a SvelteKit Page

This project demonstrates how to display the most recent YouTube video from your channel on a SvelteKit page. The code will be featured in a tutorial on my YouTube channel.

The data is fetched using the YouTube Data API, which requires an API key (see instructions below).

The data fetching is not performed within the application itself, as the data does not change frequently. Instead, a GitHub Action runs once per day to fetch the data, save it to a static JSON file, commit any changes, and trigger a new deployment on Netlify. The page is rendered using this static JSON file. This approach has two advantages:

-   Only one request to the API per day.
-   Faster application performance since the page can be pre-rendered.

This method is used on my portfolio page to display the latest video: <https://scriptraccoon.dev/youtube>

## Obtaining an API Key

1. Visit the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and switch to it.
3. Navigate to APIs & Services > Library and search for the YouTube Data API v3.
4. Enable the API.
5. Go to Credentials and click "Create Credentials".
6. Select "API key".
7. Copy the generated key to the `.env` file.

## Instructions for GitHub Actions

For the deployment, you also need to add the API key to the GitHub Actions secrets and the channel ID to the GitHub Actions variables.
