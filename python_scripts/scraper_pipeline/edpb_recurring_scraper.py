from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup

import psycopg2
from dotenv import load_dotenv
import os
import requests

from infer_article_embedding import infer_article
from parse_date import parse_date_DMY
from datetime import date


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
def load_edpb_articles(base_url, page_number):
    try:
        # Wait for up to 20 seconds until the element with ID "view-row-content" is present in the DOM (articles container)
        url_to_scrape = f'{base_url}/news/news_en?page={page_number}'

        driver.get(url_to_scrape)

        element = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CLASS_NAME, "view-row-content"))
        )
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        article_containers = soup.select('.views-row')

        for container in article_containers:
            new_article = Article()
            link = container.find('a')
            complete_link = base_url + link.get('href')

            conn, cursor = connect_to_db()

            cursor.execute('SELECT 1 FROM "Article" WHERE url=%s', (new_article.url,))
            exists = cursor.fetchone()

            if exists:
                print("Article already exists in the database")
                return # If article is already in database, that means all subsequent (from initial scraping) are also in it

            driver.get(complete_link)
            new_article.url = complete_link

            element = WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "clearfix"))
            )

            article_html = driver.page_source

            article_soup = BeautifulSoup(article_html, 'html.parser')

            year, month, day = parse_date_DMY(article_soup.select_one(".news-date").text)
            new_article.date_published = date(year, month, day)

            element = article_soup.select_one('.clearfix.text-formatted.field.field--name-field-edpb-body.field--type-text-with-summary.field--label-hidden.field__item')

            title = article_soup.select_one('.article-title').text
            new_article.title = title

            children = list(element.children)

            content = []

            for i in children:
                if i == '\n':
                    continue

                children_content = i.text.split('\n')
                for j in children_content:
                    content.append(j)

            new_article.content = content
            for i in content:
                if ("Key words:" in i):
                    keyword_list = list(i[11::].split(','))
                    cleaned = [el.strip(' \xa0') for el in keyword_list]
                    new_article.keywords = cleaned
                    

            if (new_article.keywords == []):
                topic_list = article_soup.select_one('.topic-list.field__items.d-inline-block.pl-0.mb-1')
                if topic_list:
                    topics = topic_list.find_all('li')
                    new_article.keywords = [topic.text for topic in topics]

            new_article.location = "Europe"
            if ("Background information" not in content[0]):
                divs = element.find('p').text
                new_article.description = divs
            else:
                new_article.description = ""

            # Append new article to DB
            query = 'INSERT INTO "Article" (url, title, date_posted, location, description, content, keywords) VALUES (%s, %s, %s, %s, %s, %s, %s)'
            values = (new_article.url, new_article.title, new_article.date_published, new_article.location, new_article.description, new_article.content, new_article.keywords)
            cursor.execute(query, values)
            conn.commit()

            # Append article embedding to embedding table
            cursor.execute('SELECT id FROM "Article" WHERE url=%s', (new_article.url,))
            exists = cursor.fetchone()
            article_id = exists[0]

            requests.get(f"http://localhost:3000/api/cluster/{article_id}")
            
            cursor.execute('SELECT 1 FROM embeddings WHERE article_id=%s', (article_id,))
            in_embeddings = cursor.fetchone()

            if not in_embeddings:
                article_vector = infer_article(" ".join(new_article.content), article_id)
                query = 'INSERT INTO embeddings (article_id, vector) VALUES (%s, %s)'
                values = (str(article_id), article_vector.tolist())
                print("Inserted into DB")

                cursor.execute(query, values)
                conn.commit()


    except Exception as e:
        print("An error occured:", e)

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