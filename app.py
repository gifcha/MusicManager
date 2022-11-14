from flask import Flask, render_template
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

app = Flask(__name__)

spotifySongNameXpath = '//*[@id="searchPage"]/div/div/section[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[2]/div'


@app.route('/')
def index():
    return render_template('index.html')

@app.route("/search", methods=['POST'])
def search():
    #spotify search code
    url = 'https://open.spotify.com/search/damn'

    options = Options()
    options.add_argument("--headless")
    options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(options=options)
    driver.get(url)

    try:
        WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.XPATH, spotifySongNameXpath))) # gaidit 30 sekundes vai lidz elements ieladejas
    finally:
        elem = driver.find_element(By.XPATH, spotifySongNameXpath)
        spotifySongName = elem.text

    driver.quit()
    return render_template('index.html', spotify_song_name=spotifySongName)