// main code

/*
  assets:
    CHARACTER:
      pluto: https://commons.wikimedia.org/wiki/File:Pluto-transparent.png
      gpt: https://commons.wikimedia.org/wiki/File:ChatGPT_logo.svg
    BG:
      1: https://www.freepik.com/free-photo/empty-dark-room-modern-futuristic-sci-fi-background-3d-illustration_20850610.htm#fromView=search&page=1&position=31&uuid=50b07581-3d3b-4bcd-bb69-abf259d764a9
      2: https://svs.gsfc.nasa.gov/4851/
      2-1: https://www.timeanddate.com/astronomy/axial-tilt-obliquity.html / shifted 170px down
      2-2: https://www.timeanddate.com/astronomy/seasons-causes.html

      3: https://www.timeanddate.com/astronomy/moon/phases.html
      3-1: https://www.timeanddate.com/geography/southern-northern-hemisphere.html

      4: https://www.timeanddate.com/astronomy/moon/tides.html

  GAME:
    fixearth:
      earth clipart: https://www.pinclipart.com/maxpin/bxJhRi/
      background art: https://www.rawpixel.com/image/5924106/photo-image-public-domain-stars-galaxy
    rotatemoon:
      earth: https://www.flaticon.com/free-icon/worldwide_814513?term=earth&page=1&position=27&origin=search&related_id=814513
      moon: https://www.timeanddate.com/geography/southern-northern-hemisphere.html
      moon phases and new moon view: https://www.timeanddate.com/astronomy/moon/phases.html

  Crediable Sources:
    https://spaceplace.nasa.gov/seasons/en/
    https://science.nasa.gov/moon/lunar-phases-and-eclipses/
    https://www.noaa.gov/jetstream/ocean/tides
*/

function startGame(key, onEndGame) {
  let gameContainer = document.querySelector('div#game-' + key);
  gameContainer.style.display = 'block';
  gameContainer.animate([
    {
      opacity: '0'
    },
    {
      opacity: '1'
    }
  ], {
    duration: 500,
    iterations: 1,
  });
  gameContainer.onEndGame = onEndGame;
}
function endGame(key) {
  let gameContainer = document.querySelector('div#game-' + key);
  gameContainer.style.opacity = '0';
  gameContainer.animate([
    {
      opacity: '1'
    },
    {
      opacity: '0'
    }
  ], {
    duration: 500,
    iterations: 1,
  });
  setTimeout(function() {
    gameContainer.style.display = 'none';
    if (gameContainer.onEndGame) {
      gameContainer.onEndGame();
      gameContainer.onEndGame = null;
    }
  }, 500);
};

let e_game_answer_wrong_amt = 0;
function e_game_answer_wrong(callback) {
  if (e_game_answer_wrong_amt === 0) {
    let iframe = document.createElement('iframe');
    iframe.src = 'shutdown/index.html';
    iframe.classList.add('fake-shutdown-iframe');
    document.body.appendChild(iframe);
    setTimeout(function() {
      iframe.remove();
      if (callback) {
        callback();
      }
    }, 10000);
  } else {
    if (callback) {
      callback();
    }
  };
  e_game_answer_wrong_amt++;
}
let e_game_fixEarth_input = document.querySelector('input#game-fixearth-rotation');
let e_game_fixEarth_input_value = 0;
let e_game_fixEarth_text = document.querySelector('div#game-fixearth-rotation-txt');
let e_game_fixEarth_image = document.querySelector('img#game-fixearth-rotation-img');
e_game_fixEarth_input.addEventListener('input', function() {
  e_game_fixEarth_input_value = parseFloat(e_game_fixEarth_input.value);
  e_game_fixEarth_text.innerText = + e_game_fixEarth_input_value + '°';
  e_game_fixEarth_image.style.transform = `rotate(${e_game_fixEarth_input_value}deg)`;
});
function e_game_fixEarth_check() {
  let dist = Math.abs(e_game_fixEarth_input_value - 23.4);
  if (e_game_fixEarth_input_value === 23.4) {
    VModal.show('Spot on!', 'The earth\'s tilt usually sits at 23.4°.', null, null, 'Continue to PLUTO SPACE TOUR', null, function() {
      event_render87ARS_ACTIVITY_COMPLETE();
    }, null, true);
  } else if (dist < 0.4) {
    VModal.show('You\'re close enough!', 'The input system may not be perfect, so I\'ll give you the win. The earth\'s tilt usually sits at 23.4°.', null, null, 'Continue to PLUTO SPACE TOUR', null, function() {
      event_render87ARS_ACTIVITY_COMPLETE();
    }, null, true);
  } else if (dist < 10) {
    e_game_answer_wrong(function() {
      VModal.show('You\'re real close!', 'Think a little harder!', null, null, 'Ok', null, null, null, true);
    });
  } else {
    e_game_answer_wrong(function() {
      VModal.show('Dang bro...', 'you\'re a moron. that\'s all there is to it. try a li\'l harder maybe?', null, null, 'Ok', null, null, null, true);
    });
  }
};
let e_game_rotateMoon_input = document.querySelector('input#game-rotatemoon-rotation');
let e_game_rotateMoon_input_value = 0;
let e_game_rotateMoon_text = document.querySelector('span#game-rotatemoon-txt');
let e_game_rotateMoon_rotateParent = document.querySelector('div#game-rotatemoon-rotation-parent');
let e_game_rotateMoon_rotateContent = document.querySelector('img#game-rotatemoon-rotation-img');
let e_game_rotateMoon_rotateContent2 = document.querySelector('img#game-rotatemoon-rotation-img2');
function e_game_rotateMoon_input_update() {
  e_game_rotateMoon_input_value = parseFloat(e_game_rotateMoon_input.value);
  e_game_rotateMoon_rotateParent.style.transform = `rotate(${(e_game_rotateMoon_input_value / 8) * -360}deg)`;
  e_game_rotateMoon_rotateContent.style.transform = `scale(0.75) translateX(12rem) rotate(${(e_game_rotateMoon_input_value / 8) * 360}deg)`;
  e_game_rotateMoon_rotateContent2.style.transform = `rotate(${(e_game_rotateMoon_input_value / 8) * 360}deg)`;
};
e_game_rotateMoon_input_update();
e_game_rotateMoon_input.addEventListener('input', e_game_rotateMoon_input_update);
let e_game_rotateMoon_games = [];
let e_game_rotateMoon_gameIndex = 0;
let e_game_rotateMoon_phaseIndex = 0;
let e_game_rotateMoon_phaseName = "";
function e_game_rotateMoon_showPhase(phaseIndex) {
  e_game_rotateMoon_phaseIndex = phaseIndex;
  e_game_rotateMoon_phaseName = ['New Moon', 'Waxing Crescent Moon', 'First Quarter Moon', 'Waxing Gibbous Moon', 'Full Moon', 'Waning Gibbous Moon', 'Last Quarter Moon', 'Waning Crescent Moon'][phaseIndex];
  e_game_rotateMoon_text.innerText = e_game_rotateMoon_phaseName;
};
function e_game_rotateMoon_check() {
  if (e_game_rotateMoon_input_value === e_game_rotateMoon_phaseIndex) {
    e_game_rotateMoon_gameIndex++;
    let message = `The moon is currently in phase ${e_game_rotateMoon_phaseName}. <img class="d-block mt-3" src="game/rotatemoon/moon/00${e_game_rotateMoon_phaseIndex}.png">`;
    if (e_game_rotateMoon_gameIndex >= 8) {
      VModal.show('Impressive!', message, null, null, 'Continue to PLUTO SPACE TOUR', null, function() {
        event_render87BRS_ACTIVITY_COMPLETE();
      }, null, false);
    } else {
      VModal.show('Spot on!', message, null, null, `Level ${(e_game_rotateMoon_gameIndex + 1)}/${e_game_rotateMoon_games.length} > `, null, function() {
        e_game_rotateMoon_showPhase(e_game_rotateMoon_games[e_game_rotateMoon_gameIndex]);
      }, null, false);
    };
  } else {
    e_game_answer_wrong(function() {
      VModal.show('Think a little harder!', `Remember, the ${e_game_rotateMoon_phaseName} Phase ${[
        'is the first phase in the Lunar Cycle. <u>No light</u> reflected from the moon <u>is visible from the Earth.</u>',
        'occurs about 4 days into the Lunar Cycle. Think about how the moon\'s lit side would have to be positioned to look like a <u>small sliver of light</u> on the <u>right</u> side of the moon when viewing it from the Earth.',
        'occurs about 7 days into the Lunar Cycle. <strong>It\'s also called a Half Moon.</strong> Think about how the moon\'s lit side would have to be positioned to light up <u>the right side of the moon</u> when viewed from the earth.',
        'occurs about 10 days into the Lunar Cycle. Think about how the moon\'s lit side would have to be positioned to look like a <u>deformed oval</u> on the <u>right</u> side of the moon when viewing it from the Earth.',
        'occurs about 14 days into the Lunar Cycle. It\'s occurs exactly halfway through the Lunar Cycle. Think about how the moon\'s lit side would have to be positioned to look like a <u>perfect circle</u> when viewing it from the Earth.',
        'occurs about 18 days into the Lunar Cycle. Think about how the moon\'s lit side would have to be positioned to look like a <u>deformed oval</u> on the <u>left</u> side of the moon when viewing it from the Earth.',
        'occurs about 22 days into the Lunar Cycle. <strong>It\'s also called a Half Moon.</strong> Think about how the moon\'s lit side would have to be positioned to light up <u>the left side of the moon</u> when viewed from the earth.',
        'occurs about 26 days into the Lunar Cycle. Think about how the moon\'s lit side would have to be positioned to look like a <u>small sliver of light</u> on the <u>left</u> side of the moon when viewing it from the Earth.',
      ][e_game_rotateMoon_phaseIndex]
        } <img class="d-block mt-3" src="game/rotatemoon/moon/00${e_game_rotateMoon_phaseIndex}.png">`, null, null, 'Ok', null, function() { }, null, false);
    });
  }
};
function e_game_rotateMoon_gameInit() {
  for (let i = 0; i < 8; i++) {
    let num;
    do {
      num = Math.floor(Math.random() * 8);
    } while (e_game_rotateMoon_games.includes(num));
    e_game_rotateMoon_games.push(num);
  };
  e_game_rotateMoon_gameIndex = 0;
  e_game_rotateMoon_phaseIndex = 0;
  e_game_rotateMoon_phaseName = "";
  e_game_rotateMoon_showPhase(e_game_rotateMoon_games[e_game_rotateMoon_gameIndex]);
}
let e_game_makeTide_input = document.querySelector('input#game-maketide-rotation');
let e_game_makeTide_input_value = 0;
let e_game_makeTide_text = document.querySelector('span#game-maketide-txt');
let e_game_makeTide_rotateParent = document.querySelector('div#game-maketide-rotation-parent');
let e_game_makeTide_rotateContent = document.querySelector('img#game-maketide-rotation-img');
let e_game_makeTide_rotateContent2 = document.querySelector('img#game-maketide-rotation-img2');
function e_game_makeTide_input_update() {
  e_game_makeTide_input_value = parseFloat(e_game_makeTide_input.value);
  e_game_makeTide_rotateParent.style.transform = `rotate(${(e_game_makeTide_input_value / 4) * -360}deg)`;
  e_game_makeTide_rotateContent.style.transform = `scale(0.75) translateX(12rem) rotate(${(e_game_makeTide_input_value / 4) * 360}deg)`;
  e_game_makeTide_rotateContent2.style.transform = `rotate(${(e_game_makeTide_input_value / 4) * 360}deg)`;
};
e_game_makeTide_input_update();
e_game_makeTide_input.addEventListener('input', e_game_makeTide_input_update);
const e_game_makeTide_tideCircle = document.querySelector('div#game-maketide-tidecircle');
function e_game_makeTide_gameLevel(index) {
};
function e_game_makeTide_gameInit() {

};

function startDialog() {
  Guide.event(new PreloadAssets());
  //Guide.event(new SceneTransition(true, true, SceneTransitionType.SLIDE_LTR));
  Guide.event(new Interactability(false));
  Guide.event(new Background('1.jpg'));
  Guide.event(new Interactability(true));
  Guide.event(new Action(function(e) { setTimeout(e, 500); }));
  Guide.event(new SceneTransition(false, false, SceneTransitionType.SLIDE_LTR));
  Guide.event(new Character(true, CharacterType.PLUTO, Position.Left, AnimationType.SLIDE));
  Guide.event(new Dialog('Welcome to the Pluto Space Tour! I\'m Pluto (and your name doesn\'t matter to me!)', CharacterType.PLUTO));
  Guide.event(new Dialog('During this tour, you will be presented with situations that you must resolve.', CharacterType.PLUTO));
  Guide.event(new Dialog('Correct the situation in any way you see fit!', CharacterType.PLUTO));
  Guide.event(new Dialog('(Hmm... I think I can do that...)', CharacterType.PLAYER, 1));
  //Guide.event(new Action(function() {console.log('this is a callback event')}));
  Guide.event(new Dialog('Also, your computer shuts down if you incorrectly resolve a situation!', CharacterType.PLUTO));
  Guide.event(new Dialog('(WHAT?????)', CharacterType.PLAYER, 1));
  Guide.event(new Dialog('(Heh,.. he\'s probably bluffing. There is no way this foul creature can shut down my computer)', CharacterType.PLAYER, 1));
  Guide.event(new Choice('Will you continue?', [
    {
      text: 'Let\'s go!',
      action: function() {
        action_continueNotChicken();
      }
    },
    {
      text: 'I\'m a chicken',
      action: function() {
        Guide.event(new Choice('Will you continue??', [
          {
            text: 'Let\'s go!',
            action: function() {
              action_continueNotChicken();
            }
          },
          {
            text: 'I\'m a chicken',
            action: function() {
              Guide.event(new Choice('Will you continue??????', [
                {
                  text: 'Let\'s go!',
                  action: function() {
                    action_continueNotChicken();
                  }
                },
                {
                  text: 'I\'m a chicken',
                  action: function() {
                    Guide.event(new Dialog('Okay, you\'re pushing your luck.', CharacterType.PLUTO));
                    Guide.event(new Dialog('Remember, you signed a 52-page-long waiver, so you can\'t back out!!!', CharacterType.PLUTO));
                    action_continueNotChicken();
                  }
                },
              ]));
            }
          },
        ]));
      }
    },
  ]));
  function action_continueNotChicken() {
    Guide.event(new Dialog('I choose to continue.', CharacterType.PLAYER));
    Guide.event(new Dialog('Very good!!!!', CharacterType.PLUTO));
    Guide.event(new Dialog('(Evil chuckle)', CharacterType.PLUTO));
    Guide.event(new Interactability(false));
    Guide.event(new SceneTransition(true, true, SceneTransitionType.SLIDE_LTR, false));
    Guide.event(new Dialog('', CharacterType.PLUTO), true);
    Guide.event(new Background('2.jpg'));
    Guide.event(new SceneTransition(false, false, SceneTransitionType.SLIDE_LTR));
    Guide.event(new Interactability(true));
    Guide.event(new Dialog('Woah, where are we?', CharacterType.PLAYER));
    Guide.event(new Character(true, CharacterType.PLUTO, Position.Left, AnimationType.SLIDE));
    Guide.event(new Dialog('We are in space.', CharacterType.PLUTO));
    Guide.event(new Dialog('What about me...', CharacterType.PLAYER));
    Guide.event(new Dialog('Don\'t worry about that.', CharacterType.PLUTO));
    Guide.event(new Dialog('We didn\'t have the budget to give you a death scene.', CharacterType.PLUTO));
    Guide.event(new Dialog('Oh. Thanks... I guess.', CharacterType.PLAYER));
    Guide.event(new Dialog('Enough of this.', CharacterType.PLUTO));
    Guide.event(new Dialog('I brought you here for a reason.', CharacterType.PLUTO));
    Guide.event(new Dialog('On page 7 of the 52-page-waiver you signed, you agreed to fully understand the TEKS at "8.7A RS".', CharacterType.PLUTO));
    Guide.event(new Dialog('Do you wish for a mini review session over "Day, Night, and Seasons"?', CharacterType.PLUTO));
    Guide.event(new Choice('Do you wish for a mini review session over "Day, Night, and Seasons"?', [
      {
        text: 'Sure!',
        action: function() {
          Guide.event(new Background('2-1.jpg'));
          Guide.event(new Dialog('Earth doesn\'t point straight up. It\'s always at an angle: 23.4° to be specific.', CharacterType.PLUTO));
          Guide.event(new Dialog('Why is Earth at an angle?', CharacterType.PLAYER));
          Guide.event(new Dialog('Some object the size of your mom crashed into it about 4.5 billion years ago.', CharacterType.PLUTO));
          Guide.event(new Dialog('Anyways, Earth spins on this tilted axis, making day and night.', CharacterType.PLUTO));
          Guide.event(new Dialog('The side of the Earth pointing towards the sun experiences daytime, and the side pointing away experiences nighttime.', CharacterType.PLUTO));
          Guide.event(new Dialog('Earth\'s tilt is also the reason we experience seasons.', CharacterType.PLUTO));
          Guide.event(new Dialog('Why does the tilt cause seasons?', CharacterType.PLAYER));
          Guide.event(new Dialog('Well, as you can see in the diagram to the right of me, one side of the earth is closer to the right side of the screen.', CharacterType.PLUTO));
          Guide.event(new Dialog('Let\'s add the sun to our diagram...', CharacterType.PLUTO));
          Guide.event(new Background('2-2.jpg'));
          Guide.event(new Dialog('There.', CharacterType.PLUTO));
          Guide.event(new Dialog('The hemisphere tilted towards our sun will always be warmer than the hemisphere tilted away from the sun.', CharacterType.PLUTO));
          Guide.event(new Dialog('Since the direction of the Earth\'s tilt never changes, both hemispheres of the Earth will have some time closer to the sun.', CharacterType.PLUTO));
          Guide.event(new Dialog('Let\'s explore this further.', CharacterType.PLUTO));
          Guide.event(new Dialog('In Position 1, the Northern Hemisphere is closer to the sun.', CharacterType.PLUTO));
          Guide.event(new Dialog('As the Earth moves towards Position 2, the Northern Hemisphere moves away from the sun.', CharacterType.PLUTO));
          Guide.event(new Dialog('In Position 3, the Northern Hemisphere reaches the position furthest from the sun.', CharacterType.PLUTO));
          Guide.event(new Dialog('As the Earth approaches Position 4, the Northern Hemisphere moves back towards the sun, returning to the First Position.', CharacterType.PLUTO));
          Guide.event(new Dialog('I get it... Thanks, Professor Pluto!', CharacterType.PLAYER));
          event_render87ARS_QUIZ_INIT();
          event_render87ARS_QUIZ(0);
        }
      },
      {
        text: 'Do you take me for an idiot?',
        action: function() {
          Guide.event(new Dialog('What an attitude.', CharacterType.PLUTO));
          Guide.event(new Dialog('If you\'re so confident, let\'s see how you do.', CharacterType.PLUTO));
          event_render87ARS_QUIZ_INIT();
          event_render87ARS_QUIZ(0);
        }
      },
    ]));
  }
  Guide.render();
};
// sets up prof pluto seasons game
function event_render87ARS_QUIZ_INIT() {
  Guide.event(new Background('2-2.jpg'));
  Guide.event(new Dialog('Study this diagram carefully!!', CharacterType.PLUTO));
};
// after init
function event_render87ARS_QUIZ(index) {
  let q = [['Which Position is it SUMMER in the NORTHERN HEMISPHERE?', 1], ['Which Position is it WINTER in the NORTHERN HEMISPHERE?', 3], ['Which Position is it FALL in the NORTHERN HEMISPHERE?', 2], ['Which Position is it SPRING in the NORTHERN HEMISPHERE?', 4]][index]
  Guide.event(new Dialog(q[0], CharacterType.PLUTO));
  let options = [];
  for (let i = 1; i <= 4; i++) {
    options.push({
      text: `Position ${i}`,
      action: function() {
        if (i === q[1]) {
          Guide.event(new Dialog('Correct!', CharacterType.PLUTO));
          if (index === 3) {
            event_render87ARS_QUIZ_COMPLETE();
          } else {
            event_render87ARS_QUIZ(index + 1);
          }
        } else {
          Guide.event(new Dialog('Not quite...', CharacterType.PLUTO));
          event_render87ARS_QUIZ(index);
        }
      }
    });
  }
  Guide.event(new Choice(q[0], options));
  //event_render87ARS();
};
// after the prof pluto quiz
function event_render87ARS_QUIZ_COMPLETE() {
  Guide.event(new Background('2-2.jpg'));
  Guide.event(new Dialog('Wow, you\'re good at this.', CharacterType.PLUTO));
  Guide.event(new Dialog('Can I please go home now?', CharacterType.PLAYER));
  Guide.event(new Dialog('We\'re just getting started.', CharacterType.PLUTO));
  Guide.event(new Dialog('Let\'s do something fun.', CharacterType.PLUTO));
  Guide.event(new Dialog('Let\'s see....', CharacterType.PLUTO));
  Guide.event(new Interactability(false));
  Guide.event(new SceneTransition(false, true, SceneTransitionType.SLIDE_LTR, false));
  Guide.event(new Dialog('', CharacterType.PLUTO), true);
  Guide.event(new Background('2.jpg'));
  Guide.event(new SceneTransition(false, false, SceneTransitionType.SLIDE_LTR));
  Guide.event(new Interactability(true));
  Guide.event(new Dialog('Oh no!!!', CharacterType.PLUTO));
  Guide.event(new Dialog('The Earth seems to have untilted itself!', CharacterType.PLUTO));
  Guide.event(new Dialog('Please help me rotate it back to its previous rotation so we can have our seasons back!', CharacterType.PLUTO));
  Guide.event(new Dialog('Bro what are you yapping about', CharacterType.PLAYER));
  Guide.event(new Dialog('According to page 37 of the 52-page-waiver, I reserve the right to fund the Art Department to draw the Player Death Scene.', CharacterType.PLUTO));
  Guide.event(new Dialog('Fine, I\'ll do it.', CharacterType.PLAYER));
  Guide.event(new Interactability(false));
  Guide.event(new SceneTransition(false, true, SceneTransitionType.SLIDE_LTR, false));
  Guide.event(new Dialog('', CharacterType.PLAYER));
  Guide.event(new Action(function(f) {
    startGame('fixearth', f);
  }));
};
// right after the fix earth rotation game
function event_render87ARS_ACTIVITY_COMPLETE() {
  e_game_rotateMoon_gameInit();
  Guide.event(new Background('2-2.jpg'));
  Guide.event(new SceneTransition(false, false, SceneTransitionType.SLIDE_LTR));
  endGame('fixearth');
  Guide.event(new Interactability(true));
  Guide.event(new Dialog('That was easy.', CharacterType.PLAYER));
  Guide.event(new Dialog('Well, with this being your first challenge and all, I couldn\'t really make it Quantum Chromodynamics, could I?', CharacterType.PLUTO));
  Guide.event(new Dialog('But nevertheless, you did well.', CharacterType.PLUTO));
  Guide.event(new Dialog('On page 21 of the 52-page-waiver you signed, you also agreed to fully understand the TEKS at "8.7B RS".', CharacterType.PLUTO));
  Guide.event(new Dialog('Do you wish for a mini review session over "The Lunar Cycle"?', CharacterType.PLUTO));
  Guide.event(new Choice('Do you wish for a mini review session over "The Lunar Cycle"?', [
    {
      text: 'Sure!',
      action: function() {
        Guide.event(new Background('3.jpg'));
        Guide.event(new Dialog('The moon follows a counterclockwise path of orbit.', CharacterType.PLUTO));
        Guide.event(new Dialog('A full orbit around the Earth takes roughly 29.5 days.', CharacterType.PLUTO));
        //Guide.event(new Dialog('About the same amount of time it took you to process that burn.', CharacterType.PLAYER));
        Guide.event(new Dialog('The moon consists of 8 main phases.', CharacterType.PLUTO));
        Guide.event(new Background('3-1.jpg'));
        Guide.event(new Dialog('In the Northern Hemisphere (where we live!), the lit part of the moon appears to move Right to Left.', CharacterType.PLUTO));
        Guide.event(new Dialog('Scientists use the term "Waxing" to refer to when the lit portion of the moon appears to be growing.', CharacterType.PLUTO));
        Guide.event(new Dialog('And as such, they also use the term "Waning" to refer to when the lit portion of the moon appears to be shrinking.', CharacterType.PLUTO));
        Guide.event(new Dialog('Fairly simple.', CharacterType.PLAYER));
        Guide.event(new Dialog('Let\'s explore a few phases of the moon, shall we?', CharacterType.PLUTO));
        Guide.event(new Dialog('I\'d like you to follow along on the phase graphic to the right of me.', CharacterType.PLUTO));
        Guide.event(new Dialog('Yes, sir.', CharacterType.PLAYER));
        Guide.event(new Dialog('The first phase in the Lunar Cycle is the New Moon.', CharacterType.PLUTO));
        Guide.event(new Dialog('The New Moon appears to be fully dark.', CharacterType.PLUTO));
        Guide.event(new Dialog('The second phase in the Lunar Cycle is the Waxing Crescent.', CharacterType.PLUTO));
        Guide.event(new Dialog('Think of it like a croissant. A really malnourished one.', CharacterType.PLUTO));
        Guide.event(new Dialog('The Waxing Croissant is a tiny sliver that sits on the Right Side of the moon.', CharacterType.PLUTO));
        Guide.event(new Dialog('The third phase in the Lunar Cycle is the First Quarter.', CharacterType.PLUTO));
        Guide.event(new Dialog('The right half of the moon is lit up.', CharacterType.PLUTO));
        Guide.event(new Dialog('They call it the First Quarter because it\'s 25% of the way through the Lunar Cycle.', CharacterType.PLUTO));
        Guide.event(new Dialog('The fourth phase in the Lunar Cycle is the Waxing Gibbous.', CharacterType.PLUTO));
        Guide.event(new Dialog('I don\'t have a good saying for this, so...', CharacterType.PLUTO));
        Guide.event(new Character(true, CharacterType.CHATGPT, Position.Right, AnimationType.SLIDE));
        Guide.event(new Dialog('"Gibbous" sounds a bit like "give us." So, think of the gibbous moon as if it\'s saying, "Give us more!" This can help you remember that a gibbous moon looks like it\'s asking for more, with its shape being between a half moon and a full--', CharacterType.CHATGPT));
        Guide.event(new Dialog('Man who let him cook', CharacterType.PLUTO));
        Guide.event(new Dialog('As a verb, "cook" means to prepare food by applying heat, typically by baking, boiling, frying, grilling, or simmering, among other methods. It involves combining ingredients and following a recipe or personal intuition to create a dish--', CharacterType.CHATGPT));
        Guide.event(new Dialog('Get out.', CharacterType.PLUTO));
        Guide.event(new Dialog('The term "get out" is typically used as a phrasal verb with several meanings depending on context. Sometimes "get out" is used to tell someone to leave a place, especially if they are unwelcome or causing trouble. For instance--', CharacterType.CHATGPT));
        Guide.event(new Dialog('For instance you. I require you to exit this scene.', CharacterType.PLUTO));
        Guide.event(new Character(false, CharacterType.CHATGPT, Position.Right, AnimationType.SLIDE));
        Guide.event(new Dialog('If what he said didn\'t help you, I hope this bit burned it into your soggy noodle of a brain.', CharacterType.PLUTO));
        Guide.event(new Dialog('The fifth phase in the Lunar Cycle is the Full Moon.', CharacterType.PLUTO));
        Guide.event(new Dialog('It\'s fully lit.', CharacterType.PLUTO));
        Guide.event(new Dialog('After the full moon, the lit side of the moon switches from the Right side to the Left side.', CharacterType.PLUTO));
        Guide.event(new Dialog('Then, the phases are just placed in reverse.', CharacterType.PLUTO));
        Guide.event(new Dialog('Not much to review there, you can look at the graphic for that.', CharacterType.PLUTO));

        /*Guide.event(new Background('3.jpg'));
        Guide.event(new Dialog('Let\'s explore this diagram again.', CharacterType.PLUTO));
        Guide.event(new Dialog('This diagram does not have a visual representation for the sun.', CharacterType.PLUTO));
        Guide.event(new Dialog('But even without a visual represntation, you should be able to tell me where the sun is located solely by analyzing the direction of the light on the moons.', CharacterType.PLUTO));
        Guide.event(new Choice('The sun would be positioned...', [
          {
            text: '...above Proffessor Pluto',
            action: function () {
              Guide.event(new Dialog('Correct! In fact, you can tell where the sun is just by looking at the New Moon\'s position!', CharacterType.PLUTO));
              event_render87ARS_ACTIVITY_COMPLET_PART2();
            }
          },
          {
            text: '...in the void my character would have been placed in if our art budget was over $2',
            action: function () {
              Guide.event(new Dialog('That\'s not quite it. You can tell where the sun is just by looking at the New Moon\'s position!', CharacterType.PLUTO));
              event_render87ARS_ACTIVITY_COMPLET_PART2();
            }
          },
        ]));*/
        event_render87ARS_ACTIVITY_COMPLET_PART2();
      }
    },
    {
      text: 'Do you take me for an idiot?',
      action: function() {
        Guide.event(new Dialog('What an attitude. If you\'re so confident, let\'s see how you do.', CharacterType.PLUTO));
        Guide.event(new Interactability(false));
        Guide.event(new SceneTransition(false, true, SceneTransitionType.SLIDE_LTR, false));
        Guide.event(new Dialog('', CharacterType.PLAYER));
        Guide.event(new Action(function(f) {
          startGame('rotatemoon', f);
        }));
      }
    },
  ]));
};
function event_render87ARS_ACTIVITY_COMPLET_PART2() {
  /*Guide.event(new Dialog('The New Moon will always be placed between the sun and the Earth.', CharacterType.PLUTO));
  Guide.event(new Dialog('There\'s no Earth in this diagram, but it should be fairly obvious that the Earth goes in the middle.', CharacterType.PLUTO));
  Guide.event(new Dialog('Since the lit side of the moon always faces towards the sun, the unlit side must face away from the sun (towards the Earth!), forming a New Moon.', CharacterType.PLUTO));*/
  Guide.event(new Dialog('I get it... Thanks, Professor Pluto!', CharacterType.PLAYER));
  Guide.event(new Dialog('Now, let\'s test that knowledge of yours with another minigame!', CharacterType.PLUTO));
  Guide.event(new Dialog('I understand, Pighead Pluto.', CharacterType.PLAYER));
  Guide.event(new Interactability(false));
  Guide.event(new SceneTransition(false, true, SceneTransitionType.SLIDE_LTR, false));
  Guide.event(new Dialog('', CharacterType.PLAYER));
  Guide.event(new Action(function(f) {
    startGame('rotatemoon', f);
  }));
};
function event_render87BRS_ACTIVITY_COMPLETE() {
  Guide.event(new Background('3.jpg'));
  Guide.event(new SceneTransition(false, false, SceneTransitionType.SLIDE_LTR));
  endGame('rotatemoon');
  Guide.event(new Interactability(true));
  Guide.event(new Dialog('I see that you completed this minigame quite swiftly as well.', CharacterType.PLUTO));
  Guide.event(new Dialog('I know you\'re tired of me asking this by now, but I\'ll get fired if I don\'t.', CharacterType.PLUTO));
  Guide.event(new Dialog('On page 33 of the 52-page-waiver you signed, you also agreed to fully understand the TEKS at "8.7C SS".', CharacterType.PLUTO));
  Guide.event(new Dialog('Do you wish for a mini review session over "Ocean Tides"?', CharacterType.PLUTO));
  Guide.event(new Choice('Do you wish for a mini review session over "Ocean Tides"?', [
    {
      text: 'Sure!',
      action: function() {
        Guide.event(new Dialog('Tides are the rise and fall of sea levels caused by the gravitational pull from the sun and moon.', CharacterType.PLUTO));
        Guide.event(new Dialog('Let me find the background image...', CharacterType.PLUTO));
        Guide.event(new Background('4-1.jpg'));
        Guide.event(new Dialog('There.', CharacterType.PLUTO));
        Guide.event(new Dialog('This is a Spring Tide because the tide "springs" out towards the sun and moon. This type of tide occurs at the New or Full moon phases.', CharacterType.PLUTO));
        Guide.event(new Dialog('If you know basic arithmetic, you should know that up two numbers results in a larger number.', CharacterType.PLUTO));
        Guide.event(new Dialog('Same goes with gravity here.', CharacterType.PLUTO));
        Guide.event(new Dialog('When the sun and moon are lined up in a perfectly straight line, the effect their gravities add up and pull the Earth\'s water towards them.', CharacterType.PLUTO));
        Guide.event(new Dialog('During a Spring Tide, both the High and Low tides are more extreme.', CharacterType.PLUTO));
        Guide.event(new Background('4-2.jpg'));
        Guide.event(new Dialog('This is a Neap Tide. This type of tide occurs at the First and Third quarters of the Lunar Cycle.', CharacterType.PLUTO));
        Guide.event(new Dialog('When the sun and moon are lined up at a 90° angle, the gravitational pulls subtract.', CharacterType.PLUTO));
        Guide.event(new Dialog('During a Neap Tide, both the High and Low tides are much less extreme.', CharacterType.PLUTO));
        Guide.event(new Dialog('Since the moon is closer to Earth than the sun is, its effect on the tides is stronger than the sun\'s.', CharacterType.PLUTO));
        Guide.event(new Dialog('I get it... Thanks, Professor Pluto!', CharacterType.PLAYER));
        Guide.event(new Dialog('Now, let\'s start another little minigame!', CharacterType.PLUTO));
        /*Guide.event(new Dialog('...', CharacterType.PLUTO));
        Guide.event(new Dialog('Oops! I expended all of our minigame budget on the last two games!', CharacterType.PLUTO));
        Guide.event(new Dialog('I\'ll just tweak a few things here and there...', CharacterType.PLUTO));
        Guide.event(new Dialog('All finishded!', CharacterType.PLUTO));
        Guide.event(new Dialog('I\'m sending you in!', CharacterType.PLUTO));
        Guide.event(new Interactability(false));
        Guide.event(new SceneTransition(false, true, SceneTransitionType.SLIDE_LTR, false));
        Guide.event(new Dialog('', CharacterType.PLAYER));
        Guide.event(new Action(function(f) {
          startGame('maketide', f);
        }));*/
        event_render87CSS_ACTIVITY_COMPLETE();
      }
    },
    {
      text: 'Do you take me for an idiot?',
      action: function() {
        Guide.event(new Dialog('What an attitude. If you\'re so confident, let\'s see how you do.', CharacterType.PLUTO));
        event_render87CSS_ACTIVITY_COMPLETE();
        /*Guide.event(new SceneTransition(false, true, SceneTransitionType.SLIDE_LTR, false));
        Guide.event(new Dialog('', CharacterType.PLAYER));
        Guide.event(new Action(function(f) {
          startGame('maketide', f);
        }));*/
      }
    },
  ]));
};
function event_render87CSS_ACTIVITY_COMPLETE() {
  /*Guide.event(new Interactability(true));
  endGame('maketide');*/
  Guide.event(new Dialog('...', CharacterType.PLUTO));
  Guide.event(new Dialog('Oops! I expended all of our minigame budget on the last two games!', CharacterType.PLUTO));
  Guide.event(new Dialog('...', CharacterType.PLUTO));
  Guide.event(new Dialog('I\'ll just take the Moon Phase minigame and tweak a few things here and there...', CharacterType.PLUTO));
  Guide.event(new Dialog('All finishded!', CharacterType.PLUTO));
  Guide.event(new Dialog('It\'ll be a piece of cake.', CharacterType.PLAYER));
  Guide.event(new Dialog('I\'m sending you in!', CharacterType.PLUTO));
  Guide.event(new Interactability(true));
  Guide.event(new SceneTransition(false, true, SceneTransitionType.SLIDE_LTR, false));
  Guide.event(new Background('2.jpg'));
  /*Guide.event(new Action(function(f) {
    VModal.show('Critical Application Error', 'visual-novel-engine.js:815 Uncaught TypeError: Cannot read properties of null (reading \'gameProperties\')\n    at event_startGame (visual-novel-engine.js:815:17)\n    at visual-novel-engine.js:1324:3', null, null, 'Ok', null, function(e) { f(); }, null, true, false);
  }));*/
  Guide.event(new Dialog('', CharacterType.PLUTO));
  Guide.event(new SceneTransition(false, false, SceneTransitionType.SLIDE_LTR));
  Guide.event(new Interactability(true));
  Guide.event(new Dialog('Oh no! My tweaks seem to have broken the game!', CharacterType.PLUTO));
  Guide.event(new Dialog('(Yes! I don\'t have to play his stupid game!!!)', CharacterType.PLAYER, 1));
  Guide.event(new Dialog('Well, that\'s too bad. I guess I\'ll find something else for you to do.', CharacterType.PLUTO));
  Guide.event(new Dialog('I\'ve got it!', CharacterType.PLUTO));
  Guide.event(new Dialog('Right here...', CharacterType.PLUTO));
  Guide.event(new Dialog('Good luck!!!', CharacterType.PLUTO));
  Guide.event(new Dialog('(I hope you fall and need to go to the hospital)', CharacterType.PLAYER, 1));
  Guide.event(new Action(function(f) {
    showSchoologyTest(f);
  }));
  /*Guide.event(new Action(function(f) {
    startGame('maketide', f);
  }));*/
  Guide.event(new Interactability(true));
};

function showSchoologyTest(f) {
  setTimeout(function() {
    document.querySelector('div#credits-scroller').animate([
      {
        transform: 'translateY(0%)'
      },
      {
        transform: 'translateY(-140%)'
      }
    ], { duration: 30000, iterations: 1 })
  }, 1000);
  let schoology = document.querySelector('div#window-schoology');
  schoology.animate([
    {
      top: '30rem',
      left: '-30rem'
    },
    {
      top: '0rem',
      left: '20rem'
    },
  ], { duration: 400, iterations: 1 });
  schoology.style.top = '0';
  schoology.style.left = '20rem';
  schoology.style.width = '25rem';
  schoology.style.height = '15rem';
  setTimeout(function() {
    schoology.animate([
      {
        top: '0',
        left: '20rem',
        width: '25rem',
        height: '15rem',
      },
      {
        top: '2.5rem',
        left: '20rem',
        width: '25rem',
        height: '15rem',
      },
      {
        top: '0',
        left: '20rem',
        width: '25rem',
        height: '15rem',
      },
    ], { duration: 250, iterations: 1 });
    setTimeout(function() {
      schoology.animate([
        {
          top: '0',
          left: '20rem',
          width: '25rem',
          height: '15rem',
        },
        {
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
        },
      ], { duration: 50, iterations: 1 });
      schoology.style.top = '0';
      schoology.style.left = '0';
      schoology.style.width = '100%';
      schoology.style.height = '100%';
    }, 300);
  }, 500);

  let formParent = document.querySelector('div#window-schoology div#main-inner');
  const sessionTest = new SchoologyTest(
    new MultiChoice(
      "Day and Night is caused by...", //1
      null,
      [
        { text: "Earth's Gravity", correct: false },
        { text: "Earth's Revolution around the sun", correct: false },
        { text: "Earth's Rotation around its axis", correct: true },
        { text: "Skibidi Toilet", correct: false }
      ],
      //"When the Earth rotates on its axis, one side will always be facing the sun. That side experiences daytime, and the other side experiences nighttime."
    ),
    new MultiChoice(
      "Which of the following best describes Earth's Tilt?", //2
      "schoology/q/axial-tilt.png",
      [
        { text: "23.4°", correct: true },
        { text: "13.4°", correct: false },
        { text: "23°", correct: false },
        { text: "20.25°", correct: false }
      ]
    ),
    new MultiChoice(
      "Earth's tilt causes seasons...", //3
      null,
      [
        { text: "...by making Ms. A. very Skibidi Ohio.", correct: false },
        { text: "...by pushing one hemisphere towards the sun.", correct: true },
        { text: "...by pushing both hemispheres away from the sun.", correct: false },
        { text: "...by pushing the Earth into the sun.", correct: false }
      ]
    ),
    new MultiChoice(
      "The moon revolves around the Earth in which direction?", //4
      null,
      [
        { text: "Clockwise", correct: false },
        { text: "Counterclockwise", correct: true }
      ]
    ),
    new MultiChoice(
      "Which of the following accurately describes the lunar cycle?", //5
      "https://upload.wikimedia.org/wikipedia/commons/6/6a/Moon_Phase_Diagram_for_Simple_English_Wikipedia.GIF",
      [
        { text: "30 days of full moon", correct: false },
        { text: "28 days from full moon to new moon", correct: false },
        { text: "14 days from new moon to full moon", correct: true },
        { text: "7 days from new moon to full moon", correct: false }
      ]
    ),
    new MultiChoice(
      "Look at the diagram in the previous question. Which moon is the fourth in the sequence?", //6
      null,
      [
        { text: "New Moon", correct: false },
        { text: "Full Moon", correct: false },
        { text: "First Quarter", correct: false },
        { text: "Last Quarter", correct: false },
        { text: "Waxing Gibbous", correct: true },
        { text: "Waning Gibbous", correct: false },
        { text: "Waxing Crescent", correct: false },
        { text: "Waning Crescent", correct: false },
      ]
    ),
    new CheckBoxChoice(
      "Which celestial objects affect the Earth's tides?", // 7
      null,
      [,
        { text: "Pluto", correct: false },
        { text: "Sun", correct: true },
        { text: "Earth", correct: true },
        { text: "Moon", correct: true }
      ]
    ),
    new MultiChoice(
      "Which type of tide has the highest high tides and the lowest low tides?", //8
      null,
      [
        { text: "Neap Tide", correct: false },
        { text: "Ohio Tide", correct: false },
        { text: "Spring Tide", correct: true },
        { text: "Ebb Tide", correct: false }
      ]
    ),
    new MultiChoice(
      "How does the distance between the Earth and the Moon affect tidal forces?", //9
      null,
      [
        { text: "Tidal forces are stronger when the Moon is closer to the Earth.", correct: true },
        { text: "Tidal forces are weaker when the Moon is closer to the Earth.", correct: false },
        { text: "Distance between the Earth and Moon has no effect on tidal forces.", correct: false },
        { text: "Tidal forces are stronger when the Earth is closer to the Moon.", correct: false }
      ]
    ),
  );

  formParent.appendChild(sessionTest.generateHTML());
};

window.mainVisualNovelStart = function() { };
document.addEventListener('DOMContentLoaded', function() {
  //startDialog();
  window.mainVisualNovelStart = function() {
    if (true || document.fullscreenElement === mainContent) {
      let menuStart = document.querySelector('div#main-menustart');
      menuStart.style.display = 'block';
      menuStart.animate([
        {
          opacity: '1'
        },
        {
          opacity: '0'
        }
      ], {
        duration: 1000,
        iterations: 1,
      });
      window.mainVisualNovelStart = function() { };
      setTimeout(function() {
        menuStart.style.display = 'none';
        startDialog();

        /*Guide.event(new PreloadAssets());
        Guide.event(new Interactability(true));
        Guide.event(new SceneTransition(false, false, SceneTransitionType.SLIDE_LTR));
        Guide.event(new Character(true, CharacterType.PLUTO, CharacterTemplate.PLUTO, Position.Left, AnimationType.SLIDE));
        //event_render87ARS_QUIZ_COMPLETE();
        event_render87ARS_ACTIVITY_COMPLETE();
        Guide.render();*/

        /*Guide.event(new PreloadAssets());
        Guide.event(new Interactability(true));
        Guide.event(new SceneTransition(false, false, SceneTransitionType.SLIDE_LTR));
        Guide.event(new Character(true, CharacterType.PLUTO, CharacterTemplate.PLUTO, Position.Left, AnimationType.SLIDE));
        Guide.event(new Interactability(true));
        event_render87BRS_ACTIVITY_COMPLETE();
        Guide.render();*/

        gameCheckFullscreenLoop();
      }, 1000);
    } else {
      /*VModal.show('Error', 'Your fullscreen must be focused on "div#main-menustart" to start the game.', null, null, 'Enter Fullscreen', null, function () {
        if (mainContent.requestFullscreen) {
          mainContent.requestFullscreen();
        } else {
          VModal.show('Error', 'Your browser seems to not support fullscreen.', null, null, 'Ok :(', null, null, null, true);
        }
      }, null, true);*/
    }
  };
  let previousFullscreenElement = null;
  function gameCheckFullscreenLoop() {
    /*if (document.fullscreenElement !== previousFullscreenElement) {
      previousFullscreenElement = document.fullscreenElement;
      if (document.fullscreenElement === null) {
        VModal.show('Warning', 'This game is meant to be experienced in fullscreen mode.', null, null, 'Enter Fullscreen', null, function() {
          if (mainContent.requestFullscreen) {
            mainContent.requestFullscreen();
            VModal.hide();
          }
        }, null, true, false);
      } else if (document.fullscreenElement === mainContent) {
        VModal.hide();
      }
    }
    requestAnimationFrame(gameCheckFullscreenLoop);*/
  }
  /*Guide.event(new PreloadAssets());
  Guide.event(new Character(true, CharacterType.PLUTO, CharacterTemplate.PLUTO, Position.Left, AnimationType.SLIDE));
  Guide.event(new Interactability(false));
  Guide.event(new SceneTransition(false, false, SceneTransitionType.SLIDE_LTR));
  Guide.event(new Interactability(true));
  event_render87ARS_QUIZ_COMPLETE();
  //event_render87ARS_ACTIVITY_COMPLETE();
  Guide.render();*/
});