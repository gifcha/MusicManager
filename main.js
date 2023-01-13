const searchUrl = 'http://localhost:3000/search';

async function searchSongs(query) {
    const response = await fetch(`${searchUrl}?q=${query}`);
    const data = await response.json();
    return data;
}

var selectedPlayer;
var ytPlaying = false;

function SelectSoundcloudSong(songLink) {
    const link = `https://w.soundcloud.com/player/?url=${songLink}&auto_play=true`;
    document.getElementById("soundcloudFrame").setAttribute("src", link);
    selectedPlayer = 'soundcloud';
    player.stopVideo();
    ytPlaying = false;
}

function SelectYoutubeSong(ID) {
    const link = `https://www.youtube.com/embed/${ID}?autoplay=1&controls=0&loop=0&modestbranding=1&enablejsapi=1&html5=1`;
    document.getElementById("ytPlayer").setAttribute("src", link);
    togglePlay();
    selectedPlayer = 'youtube';
    ytPlaying = true;
}

function addResultsToList(data) { 
    var soundcloud = data[0];
    var youtube = data[1];
    var resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "";

    for (let i in soundcloud.collection) { 

        let ytSong = youtube.items[i]
        ytBtn = document.createElement("button");
        ytBtn.classList = "song-select-button d-flex btn btn-outline-light";
        ytBtn.innerHTML = `<img src=${ytSong.snippet.thumbnails.default.url} alt="Song image">
                    <p class="song-name">${ytSong.snippet.title}\n<i class="bi bi-youtube"></i></p>`;
        resultDiv.appendChild(ytBtn);
        let videoId = ytSong.id.videoId;
        ytBtn.onclick = function () {
            SelectYoutubeSong(videoId);
        };


        let scSong = soundcloud.collection[i];
        scBtn = document.createElement("button");
        scBtn.classList = "song-select-button d-flex btn btn-outline-light";
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
        var frame = document.getElementById("soundcloudFrame");
        var scWidget = SC.Widget(frame);
        scWidget.toggle();
    }
    else {
        if (ytPlaying === false) {
            player.playVideo();
            ytPlaying = true;
        }
        else {
            player.stopVideo();
            ytPlaying = false;
        }
    }
}



// global variable for the player
var player;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
    // create the global player from the specific iframe (#video)
    player = new YT.Player('ytPlayer', {
        events: {
            // call this function when player is ready to use
            // 'onReady': onPlayerReady,
            // 'onStateChange': onPlayerStateChange
        }
    });
}

// function onload() {
//     var frame = document.getElementById("soundcloudFrame");
//     var widget = SC.Widget(frame);
//     console.log("loaded frame")
//     widget.bind('READY', function () {
//         document.getElementById('test').innerHTML = 'DAMN';
//         // Get the current position of the track
//         widget.getVolume(function (volume) {
//             alert(volume);
//         })
//     });
// }