'use strict';
(function () {
  var uploadFormElement = document.querySelector('#upload-select-image');
  var inputValueElement = uploadFormElement.querySelector('.upload-resize-controls-value');
  var decrementBtnElement = uploadFormElement.querySelector('.upload-resize-controls-button-dec');
  var incrementBtnElement = uploadFormElement.querySelector('.upload-resize-controls-button-inc');
  var str;

  function zoomInHandler() {
    if (inputValueElement.value < 100) {
      str = String(parseInt(inputValueElement.value, 10) + 25);
      inputValueElement.value = str;
      return str;
    }
  }

  function zoomOutHandler() {
    if (inputValueElement.value > 25) {
      str = String(parseInt(inputValueElement.value, 10) - 25);
      inputValueElement.value = str;
      return str;
    }
  }

  window.initializeImageScale = function (event, element, callback) {
    if (event.currentTarget === decrementBtnElement) {
      zoomOutHandler(element);
    }
    if (event.currentTarget === incrementBtnElement) {
      zoomInHandler(element);
    }

    if (typeof callback === 'function') {
      callback(str);
    }
  };
})();
