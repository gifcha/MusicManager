const searchUrl = 'http://localhost:3000/search';

async function searchSongs(query) {
    const response = await fetch(`${searchUrl}?q=${query}`);
    const data = await response.json();
    return data;
}

var selectedPlayer;
var ytPlaying = false;

var scWidget;

function loadSoundcloud() { 
    var frame = document.getElementById("soundcloudFrame");
    scWidget = SC.Widget(frame);

    scWidget.bind(SC.Widget.Events.PLAY, function () { 
        alert("damn")
        setVolumeFromSlider();
    });
}

function SelectSoundcloudSong(songLink) {
    const link = `https://w.soundcloud.com/player/?url=${songLink}&auto_play=true`;
    document.getElementById("soundcloudFrame").setAttribute("src", link);
    selectedPlayer = 'soundcloud';
    player.stopVideo();
    ytPlaying = false;
    setVolumeFromSlider();
}

function SelectYoutubeSong(ID) {
    const link = `https://www.youtube.com/embed/${ID}?autoplay=1&controls=0&loop=0&modestbranding=1&enablejsapi=1&html5=1`;
    document.getElementById("ytPlayer").setAttribute("src", link);
    scWidget.pause();
    selectedPlayer = 'youtube';
    ytPlaying = true;
    setVolumeFromSlider();
}

function addResultsToList(data) { 
    var soundcloud = data[0];
    var youtube = data[1];
    var resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "";

    for (let i in soundcloud.collection) { 

        let ytSong = youtube.items[i]
        ytBtn = document.createElement("button");
        ytBtn.classList = "song-select-button d-flex btn btn-dark";
        ytBtn.innerHTML = `<img src=${ytSong.snippet.thumbnails.default.url} alt="Song image">
                    <p class="song-name">${ytSong.snippet.title}\n<i class="bi bi-youtube"></i></p>`;
        resultDiv.appendChild(ytBtn);
        let videoId = ytSong.id.videoId;
        ytBtn.onclick = function () {
            SelectYoutubeSong(videoId);
        };


        let scSong = soundcloud.collection[i];
        scBtn = document.createElement("button");
        scBtn.classList = "song-select-button d-flex btn btn-dark";
        scBtn.innerHTML = `<img src=${scSong.artwork_url} alt="soundcloud" onerror="this.onerror=null;this.src='https://www.shareicon.net/data/128x128/2015/09/11/99506_soundcloud_512x512.png';">
                    <p class="song-name">${scSong.title}\n`;
        resultDiv.appendChild(scBtn);
        let scLink = scSong.permalink_url;
        scBtn.onclick = function () {
            SelectSoundcloudSong(scLink);
        };
    }
}



async function submitSearch() {
    input = document.getElementById("searchInput").value;
    result = await searchSongs(input);
    console.log(result);

    addResultsToList(result);
}

document.getElementById("searchInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        submitSearch();
    }
});

function togglePlay() { 

    if (selectedPlayer === 'soundcloud') {
        scWidget.toggle();
    }
    else {
        if (ytPlaying === false) {
            player.playVideo();
            ytPlaying = true;
        }
        else {
            player.pauseVideo();
            ytPlaying = false;
        }
    }

    let btn = document.getElementById("playButton")
    if (btn.innerHTML == '<i class="bi bi-play"></i>') { btn.innerHTML = '<i class="bi bi-pause-fill"></i>'; }
    else { btn.innerHTML = '<i class="bi bi-play"></i>'; }
}



var player;

function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytPlayer', {
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onStateChange
        }
    });
}

function onStateChange(event) {
    setVolumeFromSlider();
    document.getElementById("durationSlider").setAttribute('max', player.getDuration());
    if (event.data === 1) {
        document.getElementById("durationSlider").value += 1;
    }
}

function onPlayerReady(event) { 
    setVolumeFromSlider();
}

function setVolumeFromSlider() { 
    var volume = document.getElementById("volumeSlider").value;
    player.setVolume(volume);
    scWidget.setVolume(volume);
}
