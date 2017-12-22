'use strict';
(function () {
  var MIN_VALUE_SCALE = 25;
  var MAX_VALUE_SCALE = 100;
  var STEP_CHANGE_SCALE = 25;
  var uploadFormElement = document.querySelector('#upload-select-image');
  var inputValueElement = uploadFormElement.querySelector('.upload-resize-controls-value');
  var decrementBtnElement = uploadFormElement.querySelector('.upload-resize-controls-button-dec');
  var incrementBtnElement = uploadFormElement.querySelector('.upload-resize-controls-button-inc');

  function zoomIn() {
    if (inputValueElement.value < MAX_VALUE_SCALE) {
      inputValueElement.value = String(parseInt(inputValueElement.value, 10) + STEP_CHANGE_SCALE);
    }
  }

  function zoomOut() {
    if (inputValueElement.value > MIN_VALUE_SCALE) {
      inputValueElement.value = String(parseInt(inputValueElement.value, 10) - STEP_CHANGE_SCALE);
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
