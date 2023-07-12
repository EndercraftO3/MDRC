function oneTimeNtfyListener(returnData, timeout) {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource('https://ntfy.sh/devicecontrol-' + urlId + '/sse');
    eventSource.onmessage = (messageJSON) => {
      var message = JSON.parse(messageJSON.data);
      eventSource.close();
      resolve(message[returnData]); // Resolve the promise with the received message
    };

    eventSource.onerror = (error) => {
      eventSource.close();
      reject(error); // Reject the promise with the error
    };

    if (timeout) {
      setTimeout(function() {resolve("Timeout")}, timeout);
    };
  }); 
};



//Darker or brighter background popup

function darkColorRequired(color) {
  // Convert color to HSL
  var hsl = rgbToHsl(color);
  var brightness
  if (hsl[2] > 0.85) {
    return true;
  } else {
    return false;
  }
}

function rgbToHsl(color) {
  // Remove the '#' from the color string
  color = color.substring(1);

  // Convert the hexadecimal color to RGB components
  var r = parseInt(color.substring(0, 2), 16) / 255;
  var g = parseInt(color.substring(2, 4), 16) / 255;
  var b = parseInt(color.substring(4, 6), 16) / 255;

  // Find the minimum and maximum components to calculate the lightness
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var lightness = (max + min) / 2;

  // Calculate the saturation
  var saturation = 0;
  if (max !== min) {
    var delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  }

  // Calculate the hue
  var hue = 0;
  if (max !== min) {
    switch (max) {
      case r:
        hue = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      case b:
        hue = (r - g) / delta + 4;
        break;
    }
    hue /= 6;
  }

  // Return the HSL values
  return [hue, saturation, lightness];
}