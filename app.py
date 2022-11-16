from flask import *
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

app = Flask(__name__)

soundcloudSongNameXpath = '//*[@id="content"]/div/div/div[3]/div/div/div/ul/li[1]/div/div/div/div[2]/div[1]/div/div/div[2]/a/span'
scShareBtnXpath = '//*[@id="content"]/div/div/div[3]/div/div/div/ul/li[1]/div/div/div/div[2]/div[4]/div[1]/div/div/button[3]'
scEmbedBtnXpath = '//*[@class="g-tabs g-tabs-large"]/li[1]'
scEmbedXpath = '/html/body/div[9]/div/div/div/div/div[2]/div[2]/div/div[2]/div/div[2]/div[2]/iframe'

spotifySongNameXpath = '//*[@id="searchPage"]/div/div/section[2]/div[2]/div/div/div/div[2]/div[1]/div/div[1]/div[2]/div'


@app.route('/')
def index():
    return render_template('index.html')

@app.route("/search/", methods=['POST'])
def search():
    searchInput = request.form['searchInput']

    options = Options()
    options.add_argument('--window-size=1920,1080') 
    # options.add_argument("--headless")
    options.add_argument('--disable-gpu')
    driver = webdriver.Chrome(options=options)

    #soundcloud search code
    scurl = 'https://soundcloud.com/search?q='+searchInput
    driver.get(scurl)

    try:
        WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.XPATH, '//*[@id="content"]/div/div/div[3]/div/div/div/ul/li[3]/div/div/div/div[1]/a/div/span'))) # gaidit 30 sekundes vai lidz elements ieladejas
    finally:
        elem = driver.find_element(By.XPATH, soundcloudSongNameXpath)
        scSongName = elem.text
        WebDriverWait(driver, 30).until(EC.element_to_be_clickable((By.XPATH, scShareBtnXpath)))

        driver.execute_script("""
        var element = document.querySelector("#onetrust-consent-sdk");
        if (element)
            element.parentNode.removeChild(element);
        """)    # delete cookie check overlay

        shareBtn = driver.find_element(By.XPATH, scShareBtnXpath)
        shareBtn.click()
        try:
            WebDriverWait(driver, 3).until(EC.presence_of_element_located((By.XPATH, scEmbedBtnXpath))) # gaidit 30 sekundes vai lidz elements ieladejas
        finally:
            elem = driver.find_element(By.XPATH, soundcloudSongNameXpath)
            driver.find_element(By.XPATH, scEmbedBtnXpath).click()
            scEmbed = driver.find_element(By.XPATH, scEmbedXpath)
        print(scEmbedBtnXpath)
        

    
    #spotify search code

    # url = 'https://open.spotify.com/search/'+searchInput

    # try:
    #     WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.XPATH, spotifySongNameXpath))) # gaidit 30 sekundes vai lidz elements ieladejas
    # finally:
    #     elem = driver.find_element(By.XPATH, spotifySongNameXpath)
    #     spotifySongName = elem.text

    driver.quit()
    return render_template('index.html', soundcloud_embed = scEmbed, soundcloud_song_name = scSongName)