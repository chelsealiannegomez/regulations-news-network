from iapp_recurring_scraper import load_iapp_articles
from edpb_recurring_scraper import load_edpb_articles
from reuters_recurring_scraper import load_reuters_articles
import requests
from dotenv import load_dotenv
import os
import nltk
nltk.download('stopwords')

def main():
    # IAPP Scraping Call
    NUM_ARTICLES = 8
    IAPP_URL = 'https://iapp.org'
    URL_TO_SCRAPE = f'{IAPP_URL}/news?size=n_{NUM_ARTICLES}_n'
    load_iapp_articles(IAPP_URL, URL_TO_SCRAPE)

    # EDPB Scraping Call
    EDPB_URL = 'https://www.edpb.europa.eu'
    load_edpb_articles(EDPB_URL, 0)

    # Reuters Scraping Call
    BASE_URL = "https://www.reuters.com/legal/data-privacy"
    load_reuters_articles(BASE_URL)

    load_dotenv()
    domain = os.getenv("DOMAIN")
    requests.get(f"{domain}/api/email") # Call NextJS API Endpoint to send emails

if __name__ == "__main__":
    main()