
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
import time
import random

from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.actions.wheel_input import ScrollOrigin

from bs4 import BeautifulSoup
from datetime import datetime

import undetected_chromedriver as uc

from insert_to_db import insert_json_to_db
from dotenv import load_dotenv
import os
import psycopg2



locations = ["North America", "Europe", "Africa", "Asia", "South America", "Carribean", "Central America", "Middle East", "Oceania"]

na_keywords = [
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut",
    "delaware", "florida", "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa",
    "kansas", "kentucky", "louisiana", "maine", "maryland", "massachusetts", "michigan",
    "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "new hampshire",
    "new jersey", "new mexico", "new york", "carolina", "dakota", "ohio",
    "oklahoma", "oregon", "pennsylvania", "rhode island",
    "tennessee", "texas", "utah", "vermont", "virginia", "washington", "west virginia",
    "wisconsin", "wyoming", "u.s.", "trump", ""
]

eu_keywords = [
    "aarhus", "aix‑marseille‑provence", "amsterdam", "angers", "antwerp",
    "athens", "barcelona", "bergen", "berlin", "białystok", "bilbao",
    "bologna", "bonn", "bordeaux", "braga", "bratislava", "brussels",
    "bucharest", "budapest", "burgas", "bydgoszcz", "cagliari", "copenhagen",
    "cluj‑napoca", "cologne", "constanța", "copenhagen", "debrecen", "dortmund",
    "dresden", "dublin", "düsseldorf", "espoo", "florence", "frankfurt",
    "gdańsk", "genoa", "ghent", "gijón", "gothenburg", "grenoble", "hamburg",
    "hanover", "helsinki", "kiel", "leipzig", "lisbon", "ljubljana", "london",
    "luxembourg", "lyon", "madrid", "málaga", "malmö", "marseille", "milan",
    "munich", "nantes", "nicosia", "nice", "palermo", "paris", "pilsen",
    "porto", "poznań", "prague", "rennes", "riga", "rome", "rotterdam",
    "seville", "skopje", "sofia", "stockholm", "strasbourg", "stuttgart",
    "tallinn", "tampere", "taranto", "thessaloniki", "timișoara", "tirana",
    "toulouse", "turin", "turku", "uppsala", "utrecht", "valencia",
    "valladolid", "varna", "venice", "vienna", "vilnius", "warsaw",
    "zurich", "zagreb", "zaragoza", "eu", "swiss", "britain", "geneva"
]



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

# DRIVER_PATH = '/Users/chelseagomez/Downloads/chromedriver-mac-arm64/chromedriver'

# # Set up the Chrome WebDriver
# service = Service(executable_path=DRIVER_PATH)
# driver = webdriver.Chrome(service=service)

options = uc.ChromeOptions()
prefs = {"profile.managed_default_content_settings.images": 2}
options.add_argument("--disable-gpu")
options.add_argument("--disable-extensions")
options.add_argument("--blink-settings=imagesEnabled=false")
options.add_argument("--no-sandbox")
# options.add_argument("--headless=new")
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_experimental_option("prefs", prefs)

driver = uc.Chrome(options=options)

driver.set_page_load_timeout(30)


# Scraper Function
def load_articles(base_url):
    articles_list = []
    try:
        # Wait for up to 20 seconds until the element with ID "css-jghyns" is present in the DOM (article element)
        time.sleep(random.uniform(2, 5))
        driver.get(base_url)

        driver.execute_cdp_cmd(
            "Page.addScriptToEvaluateOnNewDocument",
            {
                "source": """
                Object.defineProperty(navigator, 'webdriver', {
                    get: () => false,
                });
                """
            },
        )        

        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".story-card__tpl-common__1Q7br.story-card__tpl-feed-media-on-right-image-landscape-big__34KGa.story-card__transition-no-description-for-mobile__2uxm-.feed-list__card__Praes"))
            )
        except TimeoutException:
            print("Timeout waiting for article list")

        for i in range(20):

            element = driver.find_element(By.CSS_SELECTOR, "[data-testid='FeedContentLoadMore']")

            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'})", element)

            element.click()

            time.sleep(random.uniform(2,5))
        

        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        articles = soup.select('.story-card__tpl-common__1Q7br.story-card__tpl-feed-media-on-right-image-landscape-big__34KGa.story-card__transition-no-description-for-mobile__2uxm-.feed-list__card__Praes')
        count = 0
        print(len(articles))
        for i in articles:
            if count < 151:
                count += 1
                continue
            try: 
                relative_link = i.find('a', attrs={'data-testid':'TitleLink'})
                complete_link = "https://www.reuters.com" + relative_link.get('href')

                new_article = Article()
                new_article.url = complete_link


                conn, cursor = connect_to_db()

                cursor.execute('SELECT 1 FROM "Article" WHERE url=%s', (new_article.url,))
                exists = cursor.fetchone()

                if exists:
                    print("Article already exists in the database")
                    continue # If article is already in database, continue scraping

                
                driver.get(complete_link)
                driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(random.uniform(1, 3)) 

                try:
                    WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, ".article-body__content__17Yit"))
                    )
                except:
                    print("Article content body not found")
                    continue

                article_html = driver.page_source
                article_soup = BeautifulSoup(article_html, 'html.parser')

                title_container = article_soup.select_one('.default-article-header__heading__3cyKI')

                title = title_container.find('h1', attrs={'data-testid':'Heading'})
                new_article.title = title.text
                

                pars = article_soup.select_one('.article-body__content__17Yit')

                num = 0
                par = pars.find('div', attrs={'data-testid':f'paragraph-{num}'})
                content = []
                while par:
                    content.append(par.text)
                    num += 1
                    par = pars.find('div', attrs={'data-testid':f'paragraph-{num}'})

                new_article.content = content
                new_article.description = content[0]

                for word in content[0].split():
                    keyword = word.lower().replace('"', "").replace(".","").replace(",","").replace(":","").replace("'s","").replace("'","").replace(";","").replace("?","").replace("(","").replace(")","")

                    if keyword in na_keywords:
                        new_article.location = "North America"
                    elif keyword in eu_keywords:
                        new_article.location = "Europe"

                date_container = article_soup.find('time')
                date_string = date_container.get('datetime')
                if "." in date_string:
                    datetime_object = datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S.%fZ')
                    new_article.date_published = datetime_object
                else:
                    datetime_object = datetime.strptime(date_string, "%Y-%m-%dT%H:%M:%SZ")
                    new_article.date_published = datetime_object

                print(date_string)

                # Append new article to DB
                query = 'INSERT INTO "Article" (url, title, date_posted, location, description, content, keywords) VALUES (%s, %s, %s, %s, %s, %s, %s)'
                values = (new_article.url, new_article.title, new_article.date_published, new_article.location, new_article.description, new_article.content, new_article.keywords)
                cursor.execute(query, values)
                conn.commit()
                print("Successfully added article to database")

                articles_list.append(new_article)
            except Exception as e:
                print(f"Error on article: {complete_link} -", e)


            continue
        driver.quit()
        return articles_list
        
        
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


BASE_URL = "https://www.reuters.com/legal/data-privacy"

iapp_articles = load_articles(BASE_URL)

