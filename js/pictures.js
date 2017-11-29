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
  function getGenerateComment() {
    var randomCount;
    randomCount = getRandomInteger(1, 2);
    var text = '';
    for (var j = 0; j < randomCount; j++) {
      var indexComment = getRandomInteger(0, 5);
      text += COMMENTS[indexComment] + ' ';
      console.log(text);
    }
    return randomCount;
  }

  var blockSliderElement = document.querySelector('.gallery-overlay');// сюда
  blockSliderElement.classList.remove('hidden');

  var pictureListElement = blockSliderElement.querySelector('.picture');

  var TemplateElement = document.querySelector('#picture-template').content.querySelector('.picture');// отсюда
  var objects = [];

  function getGenerateArray() {
    for (var i = 0; i < 25; i++) {
      objects[i] = {src: getUrlImage(), likes: getCountLikes(), comments: getGenerateComment()};
    }
  }
  getGenerateArray();

  function renderPhoto(object) {
    var pictureElement = TemplateElement.cloneNode(true);

    pictureElement.querySelector('.gallery-overlay-image').src = object.src;
    pictureElement.querySelector('.picture-likes').textContent = object.likes;
    pictureElement.querySelector('.picture-comments').textContent = object.comments;

    return pictureElement;
  }

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < 1; i++) {
    fragment.appendChild(renderPhoto(objects[i]));
  }
  pictureListElement.appendChild(fragment);
})();
