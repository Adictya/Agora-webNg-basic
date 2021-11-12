let appId = "c586c1c6cc03423a8f32e7fbffff7032";

let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264",
});

let remoteContainer = document.getElementById("remoteStream");
let globalStream;
let isAudiomuted = false;
let isVideomuted = false;

let handlefail = function (err) {
    console.log(err);
};

client.init(
    appId,
    () => console.log("AgoraRTC Client initialized"),
    handlefail
);

client.on("stream-added", function (evt) {
    client.subscribe(evt.stream, handlefail);
});

client.on("stream-subscribed", function (evt) {
    console.log("I was called");
    let stream = evt.stream;
    addVideoStream(stream.getId());
    stream.play(stream.getId());
});

function addVideoStream(streamId) {
    let streamdiv = document.createElement("div");
    streamdiv.id = streamId;
    streamdiv.style.transform = "rotateY(180deg)";
    streamdiv.style.height = "500px";
    remoteContainer.appendChild(streamdiv);
}

function RemoveVideoStream(streamId) {
    let stream = evt.stream;
    stream.stop();
    let remDiv = document.getElementById(stream.getId());
    remDiv.parentNode.removeChild(remDiv);

    console.log("Remote stream is removed" + stream.getId());
}

client.on("stream-removed", RemoveVideoStream);

client.on("peer-leave", RemoveVideoStream);

document.getElementById("join").onclick = function () {
    let channelName = document.getElementById("ChannelName").value;
    let userName = document.getElementById("userName").value;

    client.join(
        null,
        channelName,
        userName,
        () => {
            var localStream = AgoraRTC.createStream({
                video: true,
                audio: true,
                screen: false,
            });

            globalStream = localStream;

            localStream.init(function () {
                localStream.play("SelfStream");
                client.publish(localStream);
            });
            console.log(`App id: ${appId}\nChannel id: ${channelName}`);
        },
        handlefail
    );
};

document.getElementById("leave").onclick = function () {
    client.leave(function () {
        console.log("Channel Left");
    }, handlefail);
};

document.getElementById("screenshare").onclick = function () {
    if (!isVideomuted) {
        globalStream.muteVideo();
        isVideomuted = true;
    } else {
        globalStream.unmuteVideo();
        isVideomuted = false;
    }
};
document.getElementById("mute").onclick = function () {
    if (!isAudiomuted) {
        globalStream.muteAudio();
        isAudiomuted = true;
    } else {
        globalStream.unmuteAudio();
        isAudiomuted = false;
    }
};
