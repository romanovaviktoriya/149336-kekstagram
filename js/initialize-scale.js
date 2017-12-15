'use strict';
(function () {
  var uploadFormElement = document.querySelector('#upload-select-image');
  var inputValueElement = uploadFormElement.querySelector('.upload-resize-controls-value');
  var decrementBtnElement = uploadFormElement.querySelector('.upload-resize-controls-button-dec');
  var incrementBtnElement = uploadFormElement.querySelector('.upload-resize-controls-button-inc');
  var str;

  function zoomIn() {
    if (inputValueElement.value < 100) {
      str = String(parseInt(inputValueElement.value, 10) + 25);
      inputValueElement.value = str;
    }
  }

  function zoomOut() {
    if (inputValueElement.value > 25) {
      str = String(parseInt(inputValueElement.value, 10) - 25);
      inputValueElement.value = str;
    }
  }

  window.initializeImageScale = function (element, callback) {
    if (element === decrementBtnElement) {
      zoomOut();
    }
    if (element === incrementBtnElement) {
      zoomIn();
    }

    if (typeof callback === 'function') {
      callback(str);
    }
  };
})();
