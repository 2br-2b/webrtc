var background = {
  send: function (id, data) {
    chrome.runtime.sendMessage({path: 'page-to-background', method: id, data: data});
  },
  receive: function (id, callback) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.path == 'background-to-page') {
        if (request.method == id) {
          callback(request.data);
        }
      }
    });
  }
};

/* 
  Disable "WebRTC Features" & "WebRTC Media Device Enumeration "
*/

function changeWebRTC(data) {
  var script = document.getElementById("webrtc-control");
  if (script) script.parentNode.removeChild(script);
  var allowedUrls = ["hangouts.google.com", "facebook.com"];
  var isAllowed = allowedUrls.find((url)=>document.location.host === url);
  if (data.state === "enabled" && !isAllowed) {
    try {
      var webrtc = '(' + function () {
        if (typeof navigator.getUserMedia !== "undefined") navigator.getUserMedia = undefined;
        if (typeof window.MediaStreamTrack !== "undefined") window.MediaStreamTrack = undefined;
        if (typeof window.RTCPeerConnection !== "undefined") window.RTCPeerConnection = undefined;
        if (typeof navigator.webkitGetUserMedia !== "undefined") navigator.webkitGetUserMedia = undefined;
        if (typeof window.RTCSessionDescription !== "undefined") window.RTCSessionDescription = undefined;
        if (typeof window.webkitMediaStreamTrack !== "undefined") window.webkitMediaStreamTrack = undefined;
        if (typeof window.webkitRTCPeerConnection !== "undefined") window.webkitRTCPeerConnection = undefined;
        if (typeof window.webkitRTCSessionDescription !== "undefined") window.webkitRTCSessionDescription = undefined;
      } + ')();';
      /*  */
      var script = document.createElement('script');
      script.setAttribute("id", "webrtc-control");
      script.textContent = webrtc;
      var head = document.head || document.documentElement;
      if (head) head.appendChild(script);
    }
    catch (e) {}
  } else {
    console.warn("currently allowing ", document.location.host);
  }
};