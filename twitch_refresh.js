var lastResponse = null;

function portConnection() {
    var port = chrome.runtime.connect();
    console.log("Is port connected ? ", port);
    console.log($("#animallist"));
    port.onMessage.addListener();
}
function getResp(response) {
    lastResponse = response;
    console.log(response.data);
    $("#animallist").empty();
    console.log("Connect");
    for (var i = 0; i < response.data.length; i++) {
        var streamer = response.data[i];
        streamer.stream = (i == 0 ? null : 'live');
        var newContent = $('<tr class="animallist"></tr>"');
        console.log(newContent);
        newContent.append('<td><img src="' + streamer.logo + '" alt="Logo de ' + streamer.display_name + '" /></td>')
        let classIconState = streamer.stream == null ? 'fas fa-microphone-alt-slash' : 'fas fa-lightbulb';
        let textState = streamer.stream == null ? 'Hors ligne' : 'En stream !';
        let classState = streamer.stream == null ? 'off' : 'on';
        newContent.append('<td><span class="streamer_name">' + streamer.display_name + '</span><span class="stream_state ' + classState + '"><i class="' + classIconState + '"></i> ' + textState + '</span></td>')
        newContent.append('<td><div class="align-checkbox"><input type="checkbox" id="' + streamer._id + 'Switch" /><label for="' + streamer._id + 'Switch"></label></div>');
        $("#animallist").append(newContent);
    }
}

console.log("Port connection launch once");
setTimeout(portConnection, 1000);
