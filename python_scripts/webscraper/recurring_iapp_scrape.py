from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json

from keybert_extraction import extract_keywords
from insert_to_db import insert_json_to_db

import psycopg2
from dotenv import load_dotenv
import os

locations = ["North America", "Europe", "Africa", "Asia", "South America", "Carribean", "Central America", "Middle East", "Oceania"]

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
            new_article = Article()
            new_article.url = base_url + article.get('href')

            conn, cursor = connect_to_db()

            cursor.execute('SELECT 1 FROM "Article" WHERE url=%s', (new_article.url,))
            exists = cursor.fetchone()

            if exists:
                print("Article already exists in the database")
                return # If article is already in database, that means all subsequent (from initial scraping) are also in it

            content = article.find_all('p')
            if len(content) == 3:
                new_article.date_published = content[1].text
                new_article.title = content[2].text
            elif len(content) == 2:
                new_article.date_published = content[0].text
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
                    content_text.append(paragraph[0].text) # Append to content by paragraph

            new_article.content = content_text

            if "Editor's note" in content_text[0]: # If editor's note is first in content, use second line for description
                new_article.description = content_text[1]
            else:
                new_article.description = content_text[0]

            # Append new article to DB
            query = 'INSERT INTO "Article" (url, title, date_posted, location, description, content, keywords) VALUES (%s, %s, %s, %s, %s, %s, %s)'
            values = (new_article.url, new_article.title, new_article.date_published, new_article.location, new_article.description, new_article.content, new_article.keywords)
            cursor.execute(query, values)
            conn.commit()
            print("Successfully added article to database")
                        
            articles_list.append(new_article)
        
        return articles_list

    except Exception as e:
        print("Error occured:", e)

    finally:
        # Quit Driver
        driver.quit()


# Connect to DB Function
def connect_to_db():
    try:
        load_dotenv()
        host = os.getenv("PGHOST")
        conn_string = f"host={host} dbname={os.getenv("PGDATABASE")} user={os.getenv("PGUSER")} password={os.getenv("PGPASSWORD")}"

        conn = psycopg2.connect(conn_string)

        cursor = conn.cursor()

        return conn, cursor

    except Exception as e:
        return "Error connecting to database:", e

# IAPP Scraping Call
NUM_ARTICLES = 8
BASE_URL = 'https://iapp.org'
URL_TO_SCRAPE = f'{BASE_URL}/news?size=n_{NUM_ARTICLES}_n'

iapp_articles = load_articles(BASE_URL, URL_TO_SCRAPE)

file_path = "articles.json"
with open(file_path, 'w') as f:
    json.dump(iapp_articles, f, indent=4, default=lambda o: o.__dict__)

# insert_json_to_db(iapp_articles)