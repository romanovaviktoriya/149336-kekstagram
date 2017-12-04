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
    var text = '';
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
    return [comments, randomCount];
  }

  var galleryOverlayElement = document.querySelector('.gallery-overlay');

  var pictureListElement = document.querySelector('.pictures');

  var templateElement = document.querySelector('#picture-template').content.querySelector('.picture');
  var pictures = [];

  function getGenerateArray() {
    for (var i = 0; i < 25; i++) {
      pictures[i] = {src: getUrlImage(i), likes: getCountLikes(), comments: generateComments(), index: i};
    }
  }
  getGenerateArray();

  function renderPhoto(object) {
    var pictureElement = templateElement.cloneNode(true);

    pictureElement.querySelector('img').src = object.src;
    pictureElement.querySelector('.picture-likes').textContent = object.likes;
    pictureElement.querySelector('.picture-comments').textContent = object.comments[1];

    return pictureElement;
  }

  function renderMainPhoto(object) {
    function getMatchStr() {
      for (var i = 0; i < pictures.length; i++) {
        var str = object.src;
        var reg = pictures[i];
        var result = str.match(reg.src);
        if (result) {
          return [pictures[i].comments[1], pictures[i].likes];
        }
      }
    }
    galleryOverlayElement.querySelector('img').src = object.src;
    galleryOverlayElement.querySelector('.likes-count').textContent = getMatchStr(object)[1];
    galleryOverlayElement.querySelector('.comments-count').textContent = getMatchStr(object)[0];
  }

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 25; i++) {
    fragment.appendChild(renderPhoto(pictures[i]));
  }
  pictureListElement.appendChild(fragment);

  function onSliderEscPress(e) {
    if (e.keyCode === ESC_KEYCODE) {
      closeSlider();
    }
  }

  function openSlider() {
    event.preventDefault();
    galleryOverlayElement.classList.remove('hidden');
    document.addEventListener('keydown', onSliderEscPress);
  }

  function closeSlider() {
    galleryOverlayElement.classList.add('hidden');
    document.removeEventListener('keydown', onSliderEscPress);
  }
  var slidersOpen = document.querySelectorAll('.picture');
  var sliderClose = galleryOverlayElement.querySelector('.gallery-overlay-close');
  var clickedElement = null;

  for (var z = 0; z <= slidersOpen.length - 1; z++) {
    slidersOpen[z].tabIndex = 0;
    slidersOpen[z].querySelector('img').tabIndex = -1;
  }

  sliderClose.tabIndex = 0;

  function clickHandler(e) {
    e.preventDefault();
    clickedElement = e.currentTarget;
    var el = clickedElement.children[0];
    renderMainPhoto(el);
    openSlider();
  }

  for (var j = 0; j <= slidersOpen.length - 1; j++) {
    slidersOpen[j].addEventListener('click', clickHandler, true);
    slidersOpen[j].addEventListener('keydown', clickHandler, true);
  }

  sliderClose.addEventListener('click', function () {
    closeSlider();
  });

  sliderClose.addEventListener('keydown', function (e) {
    if (e.keyCode === ENTER_KEYCODE) {
      closeSlider();
    }
  });
})();
