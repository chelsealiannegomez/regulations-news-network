from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import json

articles_list = []
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
driver = webdriver.Chrome(executable_path=DRIVER_PATH)

NUM_ARTICLES = 10
BASE_URL = 'https://iapp.org'
URL_TO_SCRAPE = f'{BASE_URL}/news?size=n_{NUM_ARTICLES}_n'

try:
    # Wait for up to 20 seconds until the element with ID "css-jghyns" is present in the DOM (article element)
    driver.get(URL_TO_SCRAPE)

    element = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CLASS_NAME, "css-jghyns"))
    )
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')

    articles = soup.select('.css-jghyns')

    for article in articles:
        new_article = Article()
        new_article.url = BASE_URL + article.get('href')

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
        
        # Look for keywords
        keyword_class = article_soup.select('.css-1b4grjh')[0]

        keywords = keyword_class.find_all('button')

        article_keywords = []
        loc_count = 0

        if len(keywords) == 0:
            raise ValueError('No keywords found')

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

        content = article_soup.select('.css-al1m8k')

        if len(content) == 0:
            raise ValueError('No content found')
        
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
        
        articles_list.append(new_article)
    
    file_path = "articles.json"
    with open(file_path, 'w') as f:
        json.dump(articles_list, f, indent=4, default=lambda o: o.__dict__)

except:
    print("An error occured")

finally:
    # Quit Driver
    driver.quit()