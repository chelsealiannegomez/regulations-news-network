from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json
from datetime import date
import asyncio

from keybert_extraction import extract_keywords
from insert_to_db import insert_json_to_db
from parse_date import parse_date_DMY
from python_scripts.scraper_pipeline.translate import translate_text, is_english, translate_title

locations = ["North America", "Europe", "Africa", "Asia", "South America", "Carribean", "Central America", "Middle East", "Oceania"]

keywords_list = []

class Article:
    def __init__(self, url="", title="", location="", date_published="", keywords=[], description="", content=[]):
        self.url = url
        self.title = title
        self.location = location
        self.date_published = date_published
        self.keywords = keywords
        self.description = description
        self.content = content

# options = Options()
# options.headless = True  # Enable headless mode (not yet for development purposes)

# Set the path to the Chromedriver
DRIVER_PATH = '/Users/chelseagomez/Downloads/chromedriver-mac-arm64/chromedriver'

# Set up the Chrome WebDriver
service = Service(executable_path=DRIVER_PATH)
driver = webdriver.Chrome(service=service)

# Scraper Function
def load_articles(base_url, url_to_scrape):
    articles_list = []
    try:
        # Wait for up to 20 seconds until the element with ID "css-jghyns" is present in the DOM (article element)
        driver.get(url_to_scrape)

        element = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CLASS_NAME, "css-jghyns"))
        )
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        articles = soup.select('.css-jghyns')

        for article in articles:
            try: 
                new_article = Article()
                new_article.url = base_url + article.get('href')    

                content = article.find_all('p')
                if len(content) == 3:
                    year, month, day = parse_date_DMY(content[1].text)
                    new_article.date_published = date(year, month, day)
                    new_article.title = content[2].text
                elif len(content) == 2:
                    year, month, day = parse_date_DMY(content[0].text)
                    new_article.date_published = date(year, month, day)
                    new_article.title = content[1].text
                else:
                    raise ValueError('Article format is unexpected')
            

                # Visit article URL

                driver.get(new_article.url)

                element = WebDriverWait(driver, 20).until(
                    EC.presence_of_element_located((By.CLASS_NAME, "Article-Body"))
                )
                
                article_html = driver.page_source

                article_soup = BeautifulSoup(article_html, 'html.parser')
                
                # Look for keywords (for location)
                keyword_class = article_soup.select('.css-1b4grjh')[0]

                keywords = keyword_class.find_all('button')

                article_keywords = []

                if len(keywords) == 0:
                    article_keywords = []

                else: 
                    loc_count = 0
                    for keyword in keywords:
                        if keyword.text in locations: 
                            if loc_count == 0:
                                new_article.location = keyword.text
                                loc_count += 1
                            else:
                                new_article.location = new_article.location + ", " + keyword.text
                        else:
                            article_keywords.append(keyword.text)
                
                new_article.keywords = article_keywords

                # Get content

                content = article_soup.select('.css-al1m8k')

                if len(content) == 0:
                    print("no content")
                    continue # go to next article
                
                content_text = []
                for i in content:
                    paragraph = i.find_all('p')
                    if len(paragraph) > 0:
                        if len(paragraph[0].text) > 0: 
                            content_text.append(paragraph[0].text) # Append to content by paragraph

                new_article.content = content_text

                if len(content_text) > 1:
                    if "Editor's note" in content_text[0]: # If editor's note is first in content, use second line for description
                        new_article.description = content_text[1]
                    else:
                        new_article.description = content_text[0]

                else:
                    continue


                is_article_english = asyncio.run(is_english(new_article.title))

                if not is_article_english:
                    english_title = asyncio.run(translate_title(new_article.title))
                    english_contents = asyncio.run(translate_text(new_article.content))

                    new_article.title = english_title
                    new_article.content = english_contents
                                    
                articles_list.append(new_article)
            except:
                continue
        
        return articles_list

    except Exception as e:
        print("An error occured:", e)

    finally:
        # Quit Driver
        driver.quit()

# IAPP Scraping Call
NUM_ARTICLES = 400
BASE_URL = 'https://iapp.org'
URL_TO_SCRAPE = f'{BASE_URL}/news?size=n_{NUM_ARTICLES}_n'

iapp_articles = load_articles(BASE_URL, URL_TO_SCRAPE)

insert_json_to_db(iapp_articles)
