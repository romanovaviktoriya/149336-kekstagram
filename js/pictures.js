/**
 * Created by КузяАсер on 22.11.2017.
 */
'use strict';
(function () {
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var PICTURES_COUNT = 25;

  function getRandomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }
  function getUrlImage(i) {
    return 'photos/' + (i + 1) + '.jpg';
  }
  function getCountLikes() {
    return getRandomInteger(15, 200);
  }
  function generateComments() {
    var text;
    var comments = [];
    var randomCount = getRandomInteger(1, 10);

    for (var i = 0; i < randomCount; i++) {
      text = '';
      for (var j = 0; j < getRandomInteger(1, 2); j++) {
        var indexComment = getRandomInteger(0, 5);
        text += COMMENTS[indexComment] + ' ';
      }
      comments.push(text);
    }
    return comments;
  }

  var galleryOverlayElement = document.querySelector('.gallery-overlay');

  var pictureListElement = document.querySelector('.pictures');

  var templateElement = document.querySelector('#picture-template').content.querySelector('.picture');
  var pictures = [];

  function generatePicturesArray() {
    for (var i = 0; i < PICTURES_COUNT; i++) {
      pictures[i] = {src: getUrlImage(i), likes: getCountLikes(), comments: generateComments()};
    }
  }
  generatePicturesArray();

  function renderPhoto(object) {
    var pictureElement = templateElement.cloneNode(true);

    pictureElement.querySelector('img').src = object.src;
    pictureElement.querySelector('.picture-likes').textContent = object.likes;
    pictureElement.querySelector('.picture-comments').textContent = object.comments.length;

    return pictureElement;
  }

  function getMatchStr(object) {
    for (var i = 0; i < pictures.length; i++) {
      var str = object.src;
      var reg = pictures[i];
      var result = str.match(reg.src);
      if (result) {
        return [pictures[i].comments.length, pictures[i].likes];
      }
    }
    return [0, 0];
  }

  function renderMainPhoto(object) {
    var matchStr = getMatchStr(object);
    galleryOverlayElement.querySelector('img').src = object.src;
    galleryOverlayElement.querySelector('.likes-count').textContent = matchStr[1];
    galleryOverlayElement.querySelector('.comments-count').textContent = matchStr[0];
  }

  var fragmentElement = document.createDocumentFragment();
  for (var i = 0; i < PICTURES_COUNT; i++) {
    fragmentElement.appendChild(renderPhoto(pictures[i]));
  }
  pictureListElement.appendChild(fragmentElement);

  function sliderEscPressHandler(e) {
    if (e.keyCode === ESC_KEYCODE) {
      closeSlider();
    }
  }

  function openSlider() {
    event.preventDefault();
    galleryOverlayElement.classList.remove('hidden');
    document.addEventListener('keydown', sliderEscPressHandler);
  }

  function closeSlider() {
    galleryOverlayElement.classList.add('hidden');
    document.removeEventListener('keydown', sliderEscPressHandler);
  }
  var slidersOpenElement = document.querySelectorAll('.picture');
  var sliderCloseElement = galleryOverlayElement.querySelector('.gallery-overlay-close');

  sliderCloseElement.tabIndex = 0;

  function clickHandler(e) {
    e.preventDefault();
    var el = e.currentTarget.children[0];
    renderMainPhoto(el);
    openSlider();
  }

  for (var j = 0; j <= slidersOpenElement.length - 1; j++) {
    slidersOpenElement[j].addEventListener('click', clickHandler, true);
  }

  sliderCloseElement.addEventListener('click', function () {
    closeSlider();
  });

  sliderCloseElement.addEventListener('keydown', function (e) {
    if (e.keyCode === ENTER_KEYCODE) {
      closeSlider();
    }
  });

  var uploadFormElement = document.querySelector('#upload-select-image');
  var uploadFile = uploadFormElement.querySelector('#upload-file');
  var uploadCancel = uploadFormElement.querySelector('#upload-cancel');
  var focusUploadDescription = uploadFormElement.querySelector('.upload-form-description');

  uploadFile.addEventListener('change', function () {
    openUploadForm();
  });

  uploadCancel.addEventListener('click', function () {
    closeUploadForm();
    uploadFile.click();
  });

  function uploadFormEscPressHandler(e) {
    if (e.keyCode === ESC_KEYCODE) {
      closeUploadForm();
    }
  }

  function openUploadForm() {
    uploadFormElement.querySelector('.upload-overlay').classList.remove('hidden');
    document.addEventListener('keydown', uploadFormEscPressHandler);
  }

  function closeUploadForm() {
    if (focusUploadDescription === document.activeElement) {
      event.preventDefault();
    } else {
      uploadFormElement.querySelector('.upload-overlay').classList.add('hidden');
      document.removeEventListener('keydown', uploadFormEscPressHandler);
    }
  }

  uploadCancel.addEventListener('keydown', function (e) {
    if (e.keyCode === ENTER_KEYCODE) {
      closeUploadForm();
    }
  });

  var imagePreview = uploadFormElement.querySelector('.effect-image-preview');
  var effectImage = uploadFormElement.querySelectorAll('.upload-effect-label');

  function addEffectImageHandler(event) {
    var str = event.currentTarget.previousElementSibling.id;
    str = str.substring(7);
    imagePreview.className = 'effect-image-preview ' + str;
  }

  for (var j = 0; j <= effectImage.length - 1; j++) {
    effectImage[j].addEventListener('click', addEffectImageHandler, true);
  }

  // var controlsResizeBtn = uploadFormElement.querySelector('.upload-resize-controls-button');
  var decrementBtn = uploadFormElement.querySelector('.upload-resize-controls-button-dec');
  var incrementBtn = uploadFormElement.querySelector('.upload-resize-controls-button-inc');
  var inputValue = decrementBtn.nextElementSibling;
  var transformScale;

  function zoomIn() {
    inputValue.value = String(parseInt(inputValue.value, 10) + 25);
    transformScale = 'scale(' + inputValue.value / 100 + ')';
    imagePreview.style['transform'] = transformScale;

    return transformScale;
  }

  function zoomOut() {
    inputValue.value = String(parseInt(inputValue.value, 10) - 25);
    transformScale = 'scale(' + inputValue.value / 100 + ')';
    imagePreview.style['transform'] = transformScale;

    return transformScale;
  }

  function changeResizeHandler(event) {
    if (inputValue.value <= 25) {
      if (decrementBtn === event.target) {
        return;
      } else {
        zoomIn();
      }
    } else {
      if (inputValue.value < 100) {
        if (decrementBtn === event.target) {
          zoomOut();
        } else {
          zoomIn();
        }
      } else {
        if (decrementBtn === event.target) {
          zoomOut();
        } else {
          return;
        }
      }
    }
  }

  decrementBtn.addEventListener('click', function () {
    changeResizeHandler(event);
  });

  incrementBtn.addEventListener('click', function () {
    changeResizeHandler(event);
  });

  // --------- игнорирование регистра

  // ------- Unique elements --------
  function isUnique(arr) {
    var obj = {};

    for (var i = 0; i < arr.length; i++) {
      var str = arr[i];
      obj[str] = true;
    }

    return Object.keys(obj);
  }

  // ------- validate form --------
  function validateHashTags(str) {
    var hashArr = str.split(' ');
    console.log('Строка : ' + hashArr);
    if (hashArr.length > 5) {
      uploadFormElement.querySelector('.upload-form-hashtags').classList.add('error');
      return alert('Хэштегов больше 5');
    }

    var array = str.split(' ');
    var arrHach = [];
    var arrString = [];
    var a = [];
    for (var i = 0; i < array.length; i++) {
      // тут проверяем каждый хэштег на корректность и возвращаем ошибку, если есть

      if(array[i].length > 20) {
        return alert('Длина тега не может превышать 20 символов!');
      }
      var regexp = /(#[А-Яа-яЁё][^[A-Za-z\s!,_]{1,20}$)/gi; // регулярка
      a[i] = array[i].toLowerCase().match(regexp); // игнор регистра
    }
    function objToArray(el, el2, el3, el4, el5){
      this.el = el;
      this.el2 = el2;
      this.el3 = el3;
      this.el4 = el4;
      this.el5 = el5;
    }
    a = new objToArray(a[0], a[1], a[2], a[3], a[4]);
    for(var index in a) {
      arrHach.push(a[index]);
      arrString.push(a[index]);
    }
    var filterArrHach = arrHach.filter(function(n){ return n != undefined }); // очистка массива от пустых значений
    var filterArrString = arrString.filter(function(n){ return n != undefined }); // очистка массива от пустых значений
    console.log('Введеная строка: ' + filterArrString);
    console.log('отобранные тэги: ' + filterArrHach + ', длина ' + filterArrHach.length);    // отобранные тэги
    var unicHach = isUnique(filterArrHach);
    console.log('Уникальные тэги: ' + unicHach  + ', длина ' + unicHach.length);
    var itogHach = String(String(unicHach).split(',', 5));

    if(String(filterArrString) === String(unicHach)) {
      console.log('Все теги уникальны. Отлично!' + filterArrHach + ' === ' + unicHach);
      return null;
    } else {
      return alert('Не уникальные тэги! ' + filterArrHach + ' !== ' + unicHach);
    }
    console.log('Не более 5 тегов! ' + itogHach + ' ' + typeof(itogHach));
    return null;
  }

  var submitBtn = uploadFormElement.querySelector('#upload-submit');

  submitBtn.addEventListener('click', function (e) {
    e.preventDefault();
    var str = uploadFormElement.querySelector('.upload-form-hashtags').value;
    if (validateHashTags(str) === null) {
      alert('Можно отправлять форму. Все гуд!');
      uploadFormElement.querySelector('.upload-form-hashtags').classList.remove('error');
      uploadFormElement.submit();
    } else {
      console.log('Форма не отправлена. Есть ошибки');
      return false;
    }
  });
})();
