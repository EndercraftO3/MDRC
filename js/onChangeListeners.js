window.addEventListener("DOMContentLoaded", async function() { // needed for page load wait
            
  elid("click-type").onchange = clickTypeChangeListener;
  function clickTypeChangeListener() {
    var selectedClickType = this.value;
    if (selectedClickType === "undefined") {
      elid("click-coordinates").style.display = "none";
      elid("click-text-options").style.display = "none";
      elid("click-view-id-options").style.display = "none";
      elid("click-execute").disabled = "true";
    } else {elid("click-execute").disabled = "";};
      if (selectedClickType === "X-Y") {
        elid("click-coordinates").style.display = "";
        elid("click-text-options").style.display = "none";
        elid("click-view-id-options").style.display = "none";
      };
      if (selectedClickType === "text") {
        elid("click-coordinates").style.display = "none";
        elid("click-text-options").style.display = "";
        elid("click-view-id-options").style.display = "none";
      };
      if (selectedClickType === "View ID") {
        elid("click-coordinates").style.display = "none";
        elid("click-text-options").style.display = "none";
        elid("click-view-id-options").style.display = "";
      };
    };

  elid("app-to-launch-list").onchange = appToLaunchChangeListener;
  function appToLaunchChangeListener() {
    var selectedApp = this.value;
    if (selectedApp === "Custom") {
      elid("app-to-launch-custom").style.display = "";
    } else {
      elid("app-to-launch-custom").style.display = "none";
    };
  };

  elid("web-id").onchange = ntfyListener;
  function ntfyListener() {
    var idMatches = urlId.match("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$");
    if (idMatches) {
      eventSourceNtfy.close()
      eventSourceNtfy = new EventSource('https://ntfy.sh/devicecontrol-' + urlId + '/sse');
      eventSourceNtfy.onmessage = (messageJSON) => {
        var today = new Date();
        var time = "[" + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "] : ";
        var message = JSON.parse(messageJSON.data);

        if (message.message === "You received a file: attachment.txt") { // In case response is too big
          fetch('https://ntfy.sh/file/' + message.id + '.txt')
          .then(response => response.text())
          .then(data => {
            elid("action-results").value = time + data + "\n" + elid("action-results").value;
          })
          .catch(error => {
            showToast("Error while retrieving response content !", 10000, "#ff0000", undefined, undefined, undefined, undefined);
          });
        } else {
          elid("action-results").value = time + message.message + "\n" + elid("action-results").value;
        }
      };
      eventSourceNtfy.onerror = (error) => {console.error()}
    };
  }
  var keepDeviceAwake = getCookie("keepDeviceAwake");
  if (keepDeviceAwake === true) {
    elid("keep-awake-on").style.display = "none";
    elid("keep-awake-off").style.display = "";
  } else {
    elid("keep-awake-on").style.display = "";
    elid("keep-awake-off").style.display = "none";
  };

  var webIdMatches;
  const inputElement = elid('web-id');
  inputElement.addEventListener('input', function() {
    var text = this.value
    var oldMatch = webIdMatches;
    webIdMatches = text.match("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$");
    if (oldMatch !== webIdMatches) {
      if (webIdMatches) {
        this.setAttribute("fade", "white")
      } else {
        this.setAttribute("fade", "red")
      }
    }
  });

  var toastTimeout;
  var showingToast = false;
  var toastContainer = elid('toast');

  const defaultSvgPathsFetch = await fetch("./js/json/defaultSvgPaths.json") // I took some svg and put it there (connectionOk is long because I had to resize it)
  const defaultSvgPaths = await defaultSvgPathsFetch.json();

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function showToast(message, duration, backgroundColor, textColor, imgPath, svgPaths, defaultSvgPath) {
    console.log("Already showing toast: " + showingToast);
    if (showingToast) {
      clearTimeout(toastTimeout);
      toastContainer.style.animation = "fade-out 0.2s ease-in-out forwards";
      await delay(190);
      toastContainer.style.display = "none";
      toastContainer.style.animation = "";
      toastContainer.innerHTML = '';
    }

    // Default background color if none is specified
    if (!backgroundColor.match("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")) {var backgroundColor = "#7f7f7f"}
    // Use dark color ?
    if (!textColor) {darkRequired = darkColorRequired(backgroundColor)}
    if (darkRequired) {var darkLightColor = "black"} else {var darkLightColor = "white"};

    showingToast = true;
    if (imgPath) {
      fetch(imgPath).then ((response) => {
        if (!response.ok) {
          if (darkRequired) {imgPath = "/imgs/unknown_dark.png"} else {imgPath = "/imgs/unknown.png"}; // Set image depending on darkColorRequired function result
          toastContainer.innerHTML = `<img src="` + imgPath + `" style="width: 15px; height: 20px;"> ` + message;
        } else {toastContainer.innerHTML = `<img src="` + imgPath + `" style="width: auto; max-width: 20px; height: auto; max-height:20px"> ` + message};
      })
    } else {
      toastContainer.innerHTML = message;
    }
    
    if (defaultSvgPath) {
      svgPaths = defaultSvgPaths[defaultSvgPath];
    }

    if (svgPaths) {
      toastContainer.innerHTML = `<svg id="toast-svg" xmlns="http://www.w3.org/2000/svg" style="max-width: 25px; max-height: 25px;" fill="` + darkLightColor + `" stroke="` + darkLightColor + `">` + svgPaths + `</svg>&nbsp` + message;
    }

    if (darkRequired) {toastContainer.style.color = "black"} else {toastContainer.style.color = "white"}
    if (textColor) {toastContainer.style.color = textColor} // Replace the previous line's value with defined one
    toastContainer.style.backgroundColor = backgroundColor;
    toastContainer.style.display = "flex";
    toastContainer.style.animation = "fade-in 0.3s ease-in-out";

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    
    toastTimeout = setTimeout(async function() {
      toastContainer.style.animation = "fade-out 0.3s ease-in-out";
      await delay(290);
      toastContainer.style.display = "none";
      toastContainer.style.animation = "";
      toastContainer.innerHTML = '';
      showingToast = false;
    }, duration);
  }

  toastContainer.addEventListener("click", async function() {
    console.log("Closing active toast")
    clearTimeout(toastTimeout);
    toastContainer.style.animation = "fade-out 0.2s ease-in-out forwards";
    await delay(190);
    toastContainer.style.display = "none";
    toastContainer.style.animation = "";
    toastContainer.innerHTML = '';
    showingToast = false;
  });

  window.showToast = showToast;
});
