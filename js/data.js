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

  var pictures = [];

  window.generatePicturesArray = function (index) {
    for (var i = 0; i < PICTURES_COUNT; i++) {
      pictures[i] = {src: getUrlImage(i), likes: getCountLikes(), comments: generateComments()};
    }
    return pictures[index];
  };
})();
