var streamers = [
    "malfraxfr",
    "biohair",
    "krakara",
    "sharkyssj"
]

var dataTwitch = null;
var currentPort = null;
var clientId = '96zhey6xayi3bsdmfjonn6d0z5plca';

chrome.runtime.onInstalled.addListener(function() {
    console.log("On Connect");
    chrome.runtime.onConnect.addListener(function(port) {
        console.log("Connect to port.");
        currentPort = port;
        $.ajax({
            url: 'https://api.twitch.tv/kraken/users?login=' + streamers.join(','),
            headers: {
                'Client-ID': clientId,
                'Accept': "application/vnd.twitchtv.v5+json",
                "Content-Type": "application/vnd.twitchtv.v5+json"
            },
            success: function(data) {
                dataTwitch = data.users;
                for (var i = 0; i < dataTwitch.length; i++) {
                    dataTwitch[i].stream = null;
                }
                setInterval(startCheckStream, 60000);
                startCheckStream();
            }
        })
    })
})

function startCheckStream() {
    var hasStream = false;
    for (var i = 0; i < dataTwitch.length; i++) {
        streamer = dataTwitch[i];
        // Check here if it's live
        console.log(streamer);
        $.ajax({
            url: 'https://api.twitch.tv/kraken/streams/' + streamer._id + '?stream_type=live',
            headers: {
                'Client-ID': clientId,
                'Accept': "application/vnd.twitchtv.v5+json",
                "Content-Type": "application/vnd.twitchtv.v5+json"
            },
            global: false,
            success: function(data) {
                if ((streamer.stream == null) != (data.stream == null)) {
                    dataTwitch[i].stream = data.stream;
                    if (data.stream != null) {
                        console.log("STREAMING");
                        // Add notification if storage is false and live is true
                    }
                }
                if (data.stream == null) {
                    console.log("The users has stopped streaming...");
                }
                else {
                    console.log("The users continue streaming...");
                    hasStream = true;
                }
            }
        })
    }
    if (hasStream) {
        //chrome.browserAction.enable();
    }
    if (currentPort) {
        console.log("Data twitch send");
        currentPort.postMessage({data: dataTwitch});
    }
}
