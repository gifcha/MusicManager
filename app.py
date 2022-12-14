from statistics import quantiles
from flask import *
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from ytmusicapi import YTMusic

app = Flask(__name__)

scSongXpath = '/html/body/div[1]/div[2]/div[2]/div/div/div[3]/div/div/div/ul/li[1]/div/div/div/div[1]/a'


@app.route('/')
def index():
    return render_template('index.html')

@app.route("/search/", methods=['POST'])
def search():
    searchInput = request.form['searchInput']

    options = Options()
    options.add_argument('--window-size=1920,1080') 
    options.add_argument("--headless")
    options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(options=options)


    #soundcloud search code
    scurl = 'https://soundcloud.com/search?q='+searchInput
    driver.get(scurl)

    try:
        WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.XPATH, '//*[@id="content"]/div/div/div[3]/div/div/div/ul/li[3]/div/div/div/div[1]/a/div/span'))) # gaidit 30 sekundes vai lidz elements ieladejas
    finally:
        driver.execute_script("""
        var element = document.querySelector("#onetrust-consent-sdk");
        if (element)
            element.parentNode.removeChild(element);
        """)    # delete cookie check overlay

        scSong = driver.find_element(By.XPATH, scSongXpath)
        scSongLink = scSong.get_attribute('href')
        scSongSrc = 'https://w.soundcloud.com/player/?url=' + scSongLink
        driver.close()
    
    #youtube search code
    ytmusic = YTMusic()
    results = ytmusic.search("damn")
    for song in results:
        print(song.get('title'))

    return render_template('index.html')