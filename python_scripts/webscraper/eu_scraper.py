from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import json

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
def load_articles(base_url, page_number):
    articles_list = []
    try:
        # Wait for up to 20 seconds until the element with ID "view-row-content" is present in the DOM (articles container)
        url_to_scrape = f'{BASE_URL}/news/news_en?page={PAGE}'

        driver.get(url_to_scrape)

        element = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CLASS_NAME, "view-row-content"))
        )
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        article_containers = soup.select('.views-row')

        for container in article_containers:
            link = container.find('a')
            complete_link = base_url + link.get('href')
            print(complete_link)


        return articles_list

    except Exception as e:
        print("An error occured:", e)

    finally:
        # Quit Driver
        driver.quit()


PAGE = 0
BASE_URL = 'https://www.edpb.europa.eu'

iapp_articles = load_articles(BASE_URL, PAGE)

file_path = "articles.json"
with open(file_path, 'w') as f:
    json.dump(iapp_articles, f, indent=4, default=lambda o: o.__dict__)

