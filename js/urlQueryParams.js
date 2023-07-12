var urlId;
var eventSourceNtfy;
var eventSourceNtfyConnection; // This also serves as a connectivity test

function elid(id) {return document.getElementById(id)} // Thanks FrameXX

function waitForFunction(functionName) { // Wait to call any function that is not defined yet
  return new Promise((resolve) => {
    if (typeof window[functionName] === 'function') {
      resolve();
    } else {
      setTimeout(() => resolve(waitForFunction(functionName)), 100);
    }
  });
}

window.addEventListener("DOMContentLoaded", async function() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has('id') === true) {
    urlId = urlParams.get('id');
    var idMatches = urlId.match("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$");
    if (idMatches) {
      console.log(urlId + " has been set as ID");
      var webId = elid("web-id");
      webId.value = urlId;

      function ntfyListener() { //here because the function would get called before being defined
        console.log("yes");
        eventSourceNtfy = new EventSource('https://ntfy.sh/devicecontrol-' + urlId + '/sse');
        eventSourceNtfy.onmessage = (messageJSON) => {
          var today = new Date();
          var time = "[" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "] : ";
          var message = JSON.parse(messageJSON.data);

          if (message.message === "You received a file: attachment.txt") { // In case response is too big
            fetch('https://ntfy.sh/file/11QsnS0694af.txt')
            .then(response => response.text())
            .then(data => {
              elid("action-results").value = time + data + "\n" + elid("action-results").value;
            })
            .catch(error => {
              showToast("Error while retrieving response content !", 10000, "#ff0000", undefined, undefined, undefined, undefined);
            })
          } else {
            elid("action-results").value = time + message.message + "\n" + elid("action-results").value;
          }
        };
        eventSourceNtfy.onerror = async (error) => {
          if (eventSourceNtfyConnection) {
            eventSourceNtfyConnection = false;
            await waitForFunction("showToast")
            showToast("Connection lost !", 60000, "#ff0000", undefined, undefined, undefined, "connectionNotOk")}
          }
        eventSourceNtfy.onopen = async function() {
          if (!eventSourceNtfyConnection) {
            eventSourceNtfyConnection = true;
            await waitForFunction("showToast")
            showToast("Connection established", 5000, "#00cf00", undefined, undefined, undefined, "connectionOk")
          }
        }
        
      };

      ntfyListener(); //if id already available, initialise ntfy listener now
    } else {
      console.warn(urlId + " is available from URL parameters but has not been set as ID because it doesn't match format");
      await waitForFunction("showToast");
      showToast("Invalid device identifier in url: " + urlId, 5000, "#ffcc00", undefined, undefined, undefined, "warningIcon")
    }
    }
    if (urlParams.has('code') === true) {
      var deviceCode = urlParams.get('code');
      console.log(deviceCode + " has been set as device access code");
      var deviceAccessCode = elid("device-code");
      deviceAccessCode.value = deviceCode;
    }
});