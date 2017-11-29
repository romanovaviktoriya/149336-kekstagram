/**
 * Created by КузяАсер on 22.11.2017.
 */
'use strict';
(function () {
  var URL = []; // от 1 до 25 'photos/1.jpg'
  var LIKES = []; // от 15 до 200
  var COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  function getRandomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }
  function getUrlImage() {
    return 'photos/' + getRandomInteger(1, 25) + '.jpg';
  }
  function getCountLikes() {
    return getRandomInteger(15, 200);
  }
  function generateComments() {
    var randomCount;
    randomCount = getRandomInteger(1, 10);
    var text = '';
    for (var i = 0; i < randomCount; i++) {
      for (var j = 0; j < getRandomInteger(1, 2); j++) {
        var indexComment = getRandomInteger(0, 5);
        text += COMMENTS[indexComment] + ' ';
      }
    }
    return randomCount;
  }

  var galleryOverlayElement = document.querySelector('.gallery-overlay');// сюда
  galleryOverlayElement.classList.remove('hidden');

  var pictureListElement = document.querySelector('.pictures');

  var templateElement = document.querySelector('#picture-template').content.querySelector('.picture');// отсюда
  var objects = [];

  function getGenerateArray() {
    for (var i = 0; i < 25; i++) {
      objects[i] = {src: getUrlImage(), likes: getCountLikes(), comments: generateComments()};
    }
  }
  getGenerateArray();

  function renderPhoto(object) {
    var pictureElement = templateElement.cloneNode(true);

    galleryOverlayElement.querySelector('img').src = object.src;
    galleryOverlayElement.querySelector('.likes-count').textContent = object.likes;
    galleryOverlayElement.querySelector('.comments-count').textContent = object.comments;

    pictureElement.querySelector('img').src = object.src;
    pictureElement.querySelector('.picture-likes').textContent = object.likes;
    pictureElement.querySelector('.picture-comments').textContent = object.comments;

    return pictureElement;
  }

  function renderMainPhoto(object) {
    galleryOverlayElement.querySelector('img').src = object.src;
    galleryOverlayElement.querySelector('.likes-count').textContent = object.likes;
    galleryOverlayElement.querySelector('.comments-count').textContent = object.comments;
  }

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 25; i++) {
    fragment.appendChild(renderPhoto(objects[i]));
  }
  pictureListElement.appendChild(fragment);

  var fragmentMainPhoto = document.createDocumentFragment();
  fragmentMainPhoto.appendChild(renderMainPhoto(objects[0]));
})();
