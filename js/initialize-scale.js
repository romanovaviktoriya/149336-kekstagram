'use strict';
(function () {
  var uploadFormElement = document.querySelector('#upload-select-image');
  var inputValueElement = uploadFormElement.querySelector('.upload-resize-controls-value');
  var decrementBtnElement = uploadFormElement.querySelector('.upload-resize-controls-button-dec');
  var incrementBtnElement = uploadFormElement.querySelector('.upload-resize-controls-button-inc');

  function zoomIn() {
    if (inputValueElement.value < 100) {
      inputValueElement.value = String(parseInt(inputValueElement.value, 10) + 25);
    }
  }

  function zoomOut() {
    if (inputValueElement.value > 25) {
      inputValueElement.value = String(parseInt(inputValueElement.value, 10) - 25);
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
      callback(inputValueElement.value);
    }
  };
})();
