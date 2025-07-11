from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import undetected_chromedriver as uc

from bs4 import BeautifulSoup
from datetime import date

from insert_to_db import insert_json_to_db
from parse_date import parse_date_MDY


class Article:
    def __init__(self, url="", title="", location="", date_published="", keywords=[], description="", content=[]):
        self.url = url
        self.title = title
        self.location = location
        self.date_published = date_published
        self.keywords = keywords
        self.description = description
        self.content = content


# options.headless = True  # Enable headless mode (not yet for development purposes)

# Set the path to the Chromedriver
# DRIVER_PATH = '/Users/chelseagomez/Downloads/chromedriver-mac-arm64/chromedriver'

# Set up the Chrome WebDriver
# service = Service(executable_path=DRIVER_PATH)
# driver = webdriver.Chrome(service=service)

# Scraper Function
def load_articles(base_url, url_to_scrape):
    articles_list = []
    try:

        options = uc.ChromeOptions()
        prefs = {"profile.managed_default_content_settings.images": 2}
        options.add_experimental_option("prefs", prefs)

        driver = uc.Chrome(options=options)

        driver.get(url_to_scrape)        

        element = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CLASS_NAME, "Box-w0dun1-0"))
        )

        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        articles = soup.select('.Box-w0dun1-0.MediaObject__Container-sc-19vl09d-0.dYdQiR.jNLpAT.story.story')

        for article in articles:

            new_article = Article()

            new_article.url = article.find('a').get('href')

            new_article.description = article.select_one('.Paragraph-sc-1iyax29-0.hdxKuG.Hide-kg09cx-0.hWOBmI').text
            
            new_article.title = article.find('h3').text
            
            year, month, day = parse_date_MDY(article.find('span', class_="sm-hide").text)

            new_article.date_published = date(year, month, day)
            
            driver = uc.Chrome()
            driver.get(new_article.url)
            driver.execute_cdp_cmd("Log.disable", {})


            # element = WebDriverWait(driver, 20).until(
            #     EC.presence_of_element_located((By.CSS_SELECTOR, ".Raw-slyvem-0.jDbFwb"))
            # )
            
            article_html = driver.page_source

            driver.quit()

            article_soup = BeautifulSoup(article_html, 'html.parser')

            paragraphs = article_soup.select(".Raw-slyvem-0.jDbFwb")

            content = []

            for paragraph in paragraphs:
                paragraph_text = paragraph.select_one('p')
                if paragraph_text:
                    print(paragraph_text.text)
                    content.append(paragraph_text.text)

            new_article.content = content

            new_article.location = "North America"

            new_article.keywords = []
            
            articles_list.append(new_article)
            
        
        return articles_list
    
    except TimeoutException:
        driver.save_screenshot("timeout_screenshot.png")
        print("Element not found in time!")
        
    except Exception as e:
        print("An error occured:", e)

    finally:
        # Quit Driver
        driver.quit()

# NA Scraping Call
NUM_ARTICLES = 101
BASE_URL = 'https://www.usnews.com/topics/subjects/privacy'
URL_TO_SCRAPE = f'{BASE_URL}'

na_articles = load_articles(BASE_URL, URL_TO_SCRAPE)

insert_json_to_db(na_articles)

