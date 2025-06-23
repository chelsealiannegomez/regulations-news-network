from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup


# options = Options()
# options.headless = True  # Enable headless mode

# Set the path to the Chromedriver
DRIVER_PATH = '/Users/chelseagomez/Downloads/chromedriver-mac-arm64/chromedriver'

# Set up the Chrome WebDriver
driver = webdriver.Chrome(executable_path=DRIVER_PATH)
try:
    # Wait for up to 5 seconds until the element with ID "mySuperId" is present in the DOM
    driver.get('https://iapp.org/news')

    element = WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CLASS_NAME, "css-jghyns"))
    )
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    # print(soup)

    # articles = soup.find_all('a', class_=["chakra-link", "css-jghyns"])
    articles = soup.select('.css-jghyns')
    print(articles)
    
    # for article in articles:
    #     print(article)

    # Perform actions on the element here (if needed)
    # For example: element.click()
    

finally:
    # Ensure the driver is quit properly to free up resources
    driver.quit()