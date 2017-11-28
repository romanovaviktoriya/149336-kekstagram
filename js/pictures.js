/**
 * Created by КузяАсер on 22.11.2017.
 */
'use strict';
(function () {
  /* var WIZARD_NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
  var WIZARD_SURNAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
  var COAT_COLOR = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
  var EYES_COLOR = ['black', 'red', 'blue', 'yellow', 'green'];*/

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
    var urlImage;
    var urlIndex = getRandomInteger(1, 25);
    var urlImage = 'photos/' + urlIndex + '.jpg';
    return urlImage;
  }
  function getCountLikes() {
    var countLikes;
    return countLikes = getRandomInteger(15, 200);
  }
  function getGenerateComment() {
    var randomCount;
    randomCount = getRandomInteger(1, 2);
    for (var i = 0; i <= randomCount; i++) {
      var text = '';
      text = COMMENTS[i] + ' ';
    }
    return text;
  }

  var blockSetupElement = document.querySelector('.gallery-overlay');//сюда
  blockSetupElement.classList.remove('hidden');

  var pictureListElement = blockSetupElement.querySelector('.gallery-overlay-preview');

  var similarWizardTemplateElement = document.querySelector('#picture-template').content.querySelector('.picture');//отсюда
  var wizards = [];

  function getGenerateArray() {
    for (var i = 0; i < 25; i++) {
      wizards[i] = {src: getUrlImage(URL), likes: getCountLikes(LIKES), comments: getGenerateComment(COMMENTS)};
    }
  }
  getGenerateArray();

  function renderWizard(wizard) {
    var pictureElement = similarWizardTemplateElement.cloneNode(true);

    pictureElement.querySelector('.gallery-overlay-image').src = wizard.src;
    pictureElement.querySelector('.picture-likes').style.fill = wizard.likes;
    pictureElement.querySelector('.picture-comments').style.fill = wizard.comments;

    return pictureElement;
  }

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < wizards.length; i++) {
    fragment.appendChild(renderWizard(wizards[i]));
  }
  pictureListElement.appendChild(fragment);

  blockSetupElement.querySelector('.setup-similar').classList.remove('hidden');
})();
