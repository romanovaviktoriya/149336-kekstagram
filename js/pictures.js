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

  var uploadForm = document.querySelector('#upload-select-image');
  var uploadFile = uploadForm.querySelector('#upload-file');
  var uploadCancel = uploadForm.querySelector('#upload-cancel');
  var focusUploadDescription = uploadForm.querySelector('.upload-form-description');

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
    uploadForm.querySelector('.upload-overlay').classList.remove('hidden');
    document.addEventListener('keydown', uploadFormEscPressHandler);
  }

  function closeUploadForm() {
    if (focusUploadDescription === document.activeElement) {
      event.preventDefault();
    } else {
      uploadForm.querySelector('.upload-overlay').classList.add('hidden');
      document.removeEventListener('keydown', uploadFormEscPressHandler);
    }
  }

  uploadCancel.addEventListener('keydown', function (e) {
    if (e.keyCode === ENTER_KEYCODE) {
      closeUploadForm();
    }
  });

  var imagePreview = uploadForm.querySelector('.effect-image-preview');
  var effectImage = uploadForm.querySelectorAll('.upload-effect-label');

  function addEffectImageHandler() {
    var str = this.previousElementSibling.id;
    str = str.substring(7);
    imagePreview.className = 'effect-image-preview ' + str;
  }

  for (var j = 0; j <= effectImage.length - 1; j++) {
    effectImage[j].addEventListener('click', addEffectImageHandler, true);
  }

  var controlsResizeBtn = uploadForm.querySelector('.upload-resize-controls-button');
  var decrementBtn = uploadForm.querySelector('.upload-resize-controls-button-dec');
  var incrementBtn = uploadForm.querySelector('.upload-resize-controls-button-inc');

  function changeResizeHandler() {
    var inputValue = decrementBtn.nextElementSibling;
    var transformScale;

    if (inputValue.value <= 25) {
      if (decrementBtn === document.activeElement) {
        return;
      } else {
        inputValue.value = String(parseInt(inputValue.value, 10) + 25);
        transformScale = 'scale(' + inputValue.value / 100 + ')';
        imagePreview.style['transform'] = transformScale;
      }
    } else if (inputValue.value > 25) {
      if (inputValue.value < 100) {
        if (decrementBtn === document.activeElement) {
          inputValue.value = String(parseInt(inputValue.value, 10) - 25);
          transformScale = 'scale(' + inputValue.value / 100 + ')';
          imagePreview.style['transform'] = transformScale;
        } else {
          inputValue.value = String(parseInt(inputValue.value, 10) + 25);
          transformScale = 'scale(' + inputValue.value / 100 + ')';
          imagePreview.style['transform'] = transformScale;
        }
      } else {
        if (decrementBtn === document.activeElement) {
          inputValue.value = String(parseInt(inputValue.value, 10) - 25);
          transformScale = 'scale(' + inputValue.value / 100 + ')';
          imagePreview.style['transform'] = transformScale;
        } else {
          return;
        }
      }
    }
  }

  decrementBtn.addEventListener('click', function () {
    changeResizeHandler();
  });

  incrementBtn.addEventListener('click', function () {
    changeResizeHandler();
  });

  var str = uploadForm.querySelector('.upload-form-hashtags').value;
  //var str = "#todo, #абракадабра #яМа #ау #Яма #папа  #еду #дом #ау па #маммамамамамамамамамамаамаммааа #a css #js #dwdwd #go #ухуууу! #абракадабра #ау"; // строка
  var regexp = /(#[А-Яа-яЁё][^[A-Za-z\s!,_]{1,20}(?= |$))/gi; // регулярка
  var arrHach = str.toLowerCase().match(regexp); //игнор регистра
  console.log('отобранные тэги: ' +arrHach + ', длина ' + arrHach.length);    //отобранные тэги
  var arr = String(arrHach);
  var names = arr.split(' ');  // var names = arr.split(' ', 5);

  // --------- игнорирование регистра

  // ---------

  // ------- Unique elements --------
  function unique(arr) {
    var obj = {};

    for (var i = 0; i < arr.length; i++) {
      var str = arr[i];
      obj[str] = true; // запомнить строку в виде свойства объекта
    }

    return Object.keys(obj); // или собрать ключи перебором для IE8-
  }
  var unicHach = unique(arrHach);
  console.log('Уникальные тэги: ' + unicHach);

  var itogHach = String(unicHach).split(',', 5);
  console.log('Не более 5 тегов! ' + itogHach);
    uploadForm.querySelector('.upload-form-hashtags').value = String(itogHach);
})();
