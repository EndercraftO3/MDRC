function unlock() {
  fetch("https://trigger.macrodroid.com/" + elid("web-id").value + "/devicecontrol?action=Wake&password=" + elid("device-code").value)
  .then ((Response) => {
    if (Response.ok) {
      showToast('Unlock command sent', 5000, '#0b0bbd', undefined, undefined, undefined, 'sendIcon');
    } else {
      showToast('Unable to send command, check Internet connection and webhook ID', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
    }
  })
  .catch (() => {
    showToast('Unable to send command, check Internet connection', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
  });
};

async function ping() {
  setTimeout(function() {
  fetch("https://trigger.macrodroid.com/" + elid("web-id").value + "/devicecontrol?action=ping&sent=" + Math.floor(Date.now() / 1000))
  .then ((Response) => {
    if (Response.ok) {
      showToast("Pinging device", 5000, "#0a0a8a");
    } else {
      showToast('Unable to send ping, check Internet connection and webhook ID', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
    }
  })
  .catch (() => {
    showToast('Unable to send command, check Internet connection', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
  });
  }, 200);
  try {
    const result = await oneTimeNtfyListener("message", 15000);
    console.log(result)
    if (result === "Connected") {
      showToast("Device connection confirmed", 5000, "#08bf08", undefined, undefined, undefined, "ok");
    } else if (result === "Timeout") {
      showToast("Device connection timeout", 5000, "#cc6300");
    };

  } catch (error) {
    showToast("Some bad error occured: " + error, 12000, "#bb0000");
  }
};


function executeClick() {
  fetch("https://trigger.macrodroid.com/" + elid("web-id").value + "/devicecontrol?action=Click&clicktype=" + elid("normal-long-click-type").value + "&clicktype-X-Y/text/View ID=" + elid("click-type").value + "&Click-x=" + elid("click-coordinates-X").value + "&Click-y=" + elid("click-coordinates-Y").value + "&Click-text=" + elid("text-to-click").value + "&clicktype-text-contains/matches=" + elid("click-text-contains/matches").value + elid("view-id-to-click").value + "&password=" + elid("device-code").value)
  .then ((Response) => {
    if (Response.ok) {
      showToast('Click command sent', 5000, '#0b0bbd', undefined, undefined, undefined, 'sendIcon');
    } else {
      showToast('Unable to send command, check Internet connection and webhook ID', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
    }
  })
  .catch (() => {
    showToast('Unable to send command, check Internet connection', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
  });
};

function home() {
  fetch("https://trigger.macrodroid.com/" + elid("web-id").value + "/devicecontrol?action=Home&password=" + elid("device-code").value)
  .then ((Response) => {
    if (Response.ok) {
      showToast('Home command sent', 5000, '#0b0bbd', undefined, undefined, undefined, 'sendIcon');
    } else {
      showToast('Unable to send command, check Internet connection and webhook ID', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
    }
  })
  .catch (() => {
    showToast('Unable to send command, check Internet connection', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
  });
};

// Gestures (todo)

function keepAwake(toggle) {
  fetch("https://trigger.macrodroid.com/" + elid("web-id").value + "/devicecontrol?action=No screen sleep&No screen sleep=" + toggle + "&password=" + elid("device-code").value)
  .then ((Response) => {
    if (Response.ok) {
      showToast('Keep awake command sent', 5000, '#0b0bbd', undefined, undefined, undefined, 'sendIcon');
      document.cookie = "keepDeviceAwake=" + toggle + "; expires=Thu, 1 Jan 2025 00:00:00 UTC; path=/";
      if (toggle === "true") {
        elid("keep-awake-on").style.display = "none";
        elid("keep-awake-off").style.display = "";
      } else {
        elid("keep-awake-on").style.display = "";
        elid("keep-awake-off").style.display = "none";
      };
      
    } else {
      showToast('Unable to send command, check Internet connection and webhook ID', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
    }
  })
  .catch (() => {
    showToast('Unable to send command, check Internet connection', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
  });
  
  
};

function launchApp() {
  if (elid("app-to-launch-list").value === "Custom") {
    fetch("https://trigger.macrodroid.com/" + elid("web-id").value + "/devicecontrol?action=Launch&App=" + elid("app-to-launch-custom").value + "&password=" + elid("device-code").value)
    .then ((Response) => {
      if (Response.ok) {
        showToast('Launch app command sent', 5000, '#0b0bbd', undefined, undefined, undefined, 'sendIcon');
      } else {
        showToast('Unable to send command, check Internet connection and webhook ID', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
      }
    })
    .catch (() => {
      showToast('Unable to send command, check Internet connection', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
    });
  } else {
    fetch("https://trigger.macrodroid.com/" + elid("web-id").value + "/devicecontrol?action=Launch&App=" + elid("app-to-launch-list").value + "&password=" + elid("device-code").value).then ((Response) => {
      if (Response.ok) {
        showToast('Launch app command sent', 5000, '#0b0bbd', undefined, undefined, undefined, 'sendIcon');
      } else {
        showToast('Unable to send command, check Internet connection and webhook ID', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
      }
    })
    .catch (() => {
      showToast('Unable to send command, check Internet connection', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
    });
  };
};

function sendText() {
  fetch("https://trigger.macrodroid.com/" + elid("web-id").value + "/devicecontrol?action=Paste&paste=" + elid("app-to-launch-custom").value + "&clear=" + elid("overwrite-existing-text").checked + "&password=" + elid("device-code").value)
  .then ((Response) => {
    if (Response.ok) {
      showToast('Text sent', 5000, '#0b0bbd', undefined, undefined, undefined, 'sendIcon');
    } else {
      showToast('Unable to send text, check Internet connection and webhook ID', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
    }
  })
  .catch (() => {
    showToast('Unable to send command, check Internet connection', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
  });
};

function sendCustomAction() {
  fetch("https://trigger.macrodroid.com/" + elid("web-id").value + "/devicecontrol?action=" + elid("custom-action").value + "&password=" + elid("device-code").value)
  .then ((Response) => {
    if (Response.ok) {
      showToast('Custom command "' + elid("custom-action") + '" sent', 5000, '#0b0bbd', undefined, undefined, undefined, 'sendIcon');
      elid("custom-action").value = ""
    } else {
      showToast('Unable to send command, check Internet connection and webhook ID', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
    }
  })
  .catch (() => {
    showToast('Unable to send command, check Internet connection', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
  });
  
};

function sendSingleAction(action) {
  fetch("https://trigger.macrodroid.com/" + elid("web-id").value + "/devicecontrol?action=" + action + "&password=" + elid("device-code").value)
  .then ((Response) => {
    if (Response.ok) {
      showToast('Command ' + action + ' sent', 5000, '#0b0bbd', undefined, undefined, undefined, 'sendIcon');
    } else {
      showToast('Unable to send command, check Internet connection and webhook ID', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
    }
  })
  .catch (() => {
    showToast('Unable to send command, check Internet connection', 10000, '#ff4400', undefined, undefined, undefined, 'warningIcon');
  });
};