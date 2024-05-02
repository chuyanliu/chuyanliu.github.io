let loaderScreen = document.querySelector('div#loader-screen');
let loaderScreenText = document.querySelector('div#loader-screen-txt');
function preloadAssets(urls) {
  return new Promise((resolve, reject) => {
    loaderScreen.style.display = 'flex';
    loaderScreenText.textContent = `Assets 0% Loaded`;;
    loaderScreen.animate([
      {
        opacity: '0'
      },
      {
        opacity: '1'
      }
    ], { duration: 500, iterations: 1 });
    setTimeout(function() {
      const promises = [];

      let maxIndex = 0;
      let currentIndex = 0;
      urls.forEach(url => {
        const promise = new Promise((resolve, reject) => {
          const asset = new Image();
          maxIndex++;
          asset.onload = function() {
            resolve();
            currentIndex++;

            loaderScreenText.textContent = `Assets ${Math.round((currentIndex / maxIndex) * 100)}% Loaded`;
          };
          //asset.onerror = reject;
          asset.src = url;
        });
        promises.push(promise);
      });

      if (window.needToPreloadSounds) {
        let actx = new (AudioContext || webkitAudioContext)();
        window.needToPreloadSounds.forEach(s => {
          Guide.soundMap[s.id] = {};
          promises.push(new Promise((resolve, reject) => {
            fetch(`sound/${s.src}`)
              .then(function(r) { return r.arrayBuffer(); })
              .then(function(b) {
                actx.decodeAudioData(b, function(abuffer) {
                  Guide.soundMap[s.id].actx = actx;
                  Guide.soundMap[s.id].buffer = abuffer;
                  resolve();
                });
              });
          }));
        });
      }

      Promise.all(promises)
        .then(() => {
          //console.log("All assets preloaded successfully");
          setTimeout(function() {
            loaderScreen.style.display = 'none';
          }, 500);
          loaderScreen.animate([
            {
              opacity: '1'
            },
            {
              opacity: '0'
            }
          ], { duration: 500, iterations: 1 });
          resolve();
        });
    }, 500);
  });
};
function guidePlayAudioFromId(id, loop, volume, onend) {
  let v = Guide.soundMap[id].actx.createGain();
  v.gain.value = volume;
  v.connect(Guide.soundMap[id].actx.destination);
  let s = Guide.soundMap[id].actx.createBufferSource();
  s.buffer = Guide.soundMap[id].buffer;
  s.connect(v);
  s.loop = loop;
  let o = {
    id: id,
    s: s,
    v: v,
  };
  Guide.currentSounds.push(o);
  s.onended = function() {
    Guide.currentSounds.remove(Guide.currentSounds.find(e => e.id === id));
    if (onend) {
      onend();
    }
  };
  return o;
};
function guideStopAllSounds() {
  Guide.currentSounds.forEach(e => {
    e.s.onended = null;
    e.s.stop();
  });
  Guide.currentSounds = [];
};
function guideStopAllSoundsFade(fadeoutTime = 1000) {
  Guide.currentSounds.forEach(e => {
    e.s.onended = null;
    let volume = e.v.gain.value;
    let interval = fadeoutTime / 10;
    let decreaseAmount = volume / 10;
    let fadeoutInterval = setInterval(() => {
      if (e.v.gain.value > 0) {
        e.v.gain.value -= decreaseAmount;
      } else {
        e.s.stop();
        clearInterval(fadeoutInterval);
      }
    }, interval);
  });
  Guide.currentSounds = [];
};
function guidePlayAudio(id, volume = 0.5) {
  const audio = guidePlayAudioFromId(id, false, volume).s;
  audio.start();
  return audio;
};
function guideStartLoopingAudio(id, volume = 0.25) {
  const audio = guidePlayAudioFromId(id, true, volume).s;
  audio.start();
  return audio;
};
function guideStartLoopingAudioFade(id, volume = 0.25, fadeoutTime = 1000) {
  const audio = guidePlayAudioFromId(id, true, volume);
  audio.s.start();
  audio.v.gain.value = 0;
  let fadeoutInterval = setInterval(() => {
    if (audio.v.gain.value < volume) {
      audio.v.gain.value += volume / 10;
    } else {
      audio.v.gain.value = volume;
      clearInterval(fadeoutInterval);
    }
  }, fadeoutTime / 10);
};

let mainContent = document.querySelector('div#main-content');
let ratio = 16 / 9;
function windowResize() {
  if (window.innerWidth / window.innerHeight > ratio) {
    mainContent.style.setProperty('width', (window.innerHeight * ratio) + 'px');
  } else {
    mainContent.style.setProperty('width', window.innerWidth + 'px');
  }
}
window.addEventListener('resize', windowResize);
windowResize();

function typeWriter(text, element, delay, callback) {
  let i = 0;
  const typingInterval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (Guide.userRequestSkipToEnd || i > text.length - 1) {
      clearInterval(typingInterval);
      element.textContent = text;
      Guide.isFinishedTyping = true;
      Guide.userRequestSkipToEnd = false;
      if (callback) {
        callback();
      }
    }
  }, delay);
};

const CharacterType = {
  PLUTO: 0,
  PLAYER: 1,
  CHATGPT: 2,
};
const CharacterTemplate = {
  PLUTO: {
    identifier: 'pluto',
    resting: ['default'],
    talking: ['talking1', 'talking2'],
  },
  CHATGPT: {
    identifier: 'gpt',
    resting: ['default'],
    talking: ['talking1', 'talking2'],
  }
};
const Position = {
  Left: 0,
  Right: 1,
};
const AnimationType = {
  POP: 0,
  SLIDE: 1,
  FADE: 2,
};
const SceneTransitionType = {
  CUT: 0,
  FADE: 1,
  SLIDE_LTR: 2,
  SLIDE_RTL: 3,
};
const EventType = {
  DIALOG: 0,
  CHOICE: 1,
  ACTION: 2,
  BACKGROUND: 3,
  SOUND: 4,
  INTERACTABILITY: 5,
  CHARACTER: 6,
  SCENETRANSITION: 7,
  PRELOADASSETS: 8,
  CHARACTERLOADREQUEST: 9,
  SCREENEFFECT: 10,
  SOUNDLOADREQUEST: 11,
};
const Guide = {
  events: [],
  clickElement: document.querySelector('div#main-header-clickarea'),
  textElement: document.querySelector('div#main-header-text'),
  choiceElement: document.querySelector('div#choices-menu'),
  characterParentElement: document.querySelector('div#character-parent'),
  backgroundElement: document.querySelector('img#main-background'),
  interactable: false,
  waitForRendering: false,
  waitingForNextEvent: false,
  isFinishedTyping: false,
  userRequestSkipToEnd: false,
  autoSkip: false,
  index: 0,
  activeCharacters: [],
  soundMap: {},
  currentSounds: [],
  activeTransitionElement: document.querySelector('div#transition'),
  setup() {
    Guide.clickElement.addEventListener('click', Guide.click);
  },
  render() {
    Guide.renderEvent(0);
  },
  redraw() {
    Guide.renderEvent(Guide.index);
  },
  clear() {
    Guide.events = [];
    Guide.index = 0;
    Guide.isFinishedTyping = false;
    Guide.userRequestSkipToEnd = false;
  },
  event(event, async = false) {
    Guide.events.push([event, async]);
  },
  renderEvent(index, async, noAutoNext = false) {
    if (typeof (index) === 'object' || index < Guide.events.length) {
      let event = null;
      let async = null;
      if (typeof (index) === 'object') {
        event = index;
        async = false;
      } else {
        event = Guide.events[index][0];
        async = Guide.events[index][1];
      }
      let nextEvent = async ? function() {
        //console.log('async event finish', event);
      } : Guide.nextEvent;
      if (noAutoNext) {
        nextEvent = function() { };
      }

      console.log('event', event);
      switch (event.type) {
        case EventType.PRELOADASSETS:
          {
            /*let assets = [
              'bg/1.jpg',
              'bg/2.jpg',
              'bg/2-1.jpg',
              'bg/2-2.jpg',
              'bg/3.jpg',
              'bg/3-1.jpg',
              'bg/3-2.jpg',
              /*'char/pluto-default.png',
              'char/pluto-talking1.png',
              'char/pluto-talking2.png',
              'char/gpt-default.png',
              'char/gpt-talking1.png',
              'char/gpt-talking2.png',* /
            ];*/
            let assets = window.needToPreloadAssets;
            Guide.renderEvent(new CharacterLoadRequest(CharacterType.PLUTO, CharacterTemplate.PLUTO), false, true);
            Guide.renderEvent(new CharacterLoadRequest(CharacterType.CHATGPT, CharacterTemplate.CHATGPT), false, true);
            preloadAssets(assets).then(function() {
              nextEvent();
            });
            break;
          }
        case EventType.DIALOG:
          {
            Guide.waitForRendering = true;
            if (event.text.length > 0) {
              Guide.isFinishedTyping = false;
              Guide.textElement.textContent = '';
              let jump = [
                {
                  transform: 'translateY(0%)'
                },
                {
                  transform: 'translateY(-10%)'
                },
                {
                  transform: 'translateY(0%)'
                }
              ]
              let active = Guide.activeCharacters.find(c => c.type === event.character);
              let talkingInterval = -1;
              if (active) {
                //console.log(active);
                active.element_characterParent.animate(jump, {
                  duration: 300,
                  iterations: 1,
                });
                let talkingSpriteIndex = 0;
                //console.log(event, active);
                talkingInterval = setInterval(function() {
                  talkingSpriteIndex++;
                  if (talkingSpriteIndex > active.charImgMap.talking.length - 1) {
                    talkingSpriteIndex = 0;
                  };
                  active.charImgMap.resting[0].style.display = 'none';
                  //console.log('animate talker', active.charImgMap);
                  active.charImgMap.talking.forEach((e, i) => {
                    if (i === talkingSpriteIndex) {
                      e.style.display = 'block';
                    } else {
                      e.style.display = 'none';
                    }
                  });
                }, 100)
              }
              typeWriter(event.text, Guide.textElement, 20, function() {
                if (talkingInterval > 0) {
                  clearInterval(talkingInterval);
                  active.charImgMap.talking.forEach((e, i) => {
                    e.style.display = 'none';
                  });
                  active.charImgMap.resting[0].style.display = 'block';
                }
              });
              switch (event.character) {
                case CharacterType.PLUTO:
                  Guide.textElement.style.textAlign = 'left';
                  break;
                case CharacterType.PLAYER:
                  Guide.textElement.style.textAlign = 'right';
                  break;
              };
              switch (event.dialogType) {
                case 0:
                  Guide.textElement.style.removeProperty('opacity');
                  Guide.textElement.style.removeProperty('font-style');
                  break;
                case 1:
                  Guide.textElement.style.fontStyle = 'italic';
                  Guide.textElement.style.opacity = '0.5';
                  break;
              }
            } else {
              Guide.isFinishedTyping = true;
              Guide.userRequestSkipToEnd = false;
              Guide.textElement.textContent = '';
              nextEvent();
            }
            Guide.waitForRendering = false;
            break;
          }
        case EventType.CHOICE:
          {
            Guide.choiceElement.innerHTML = '';
            Guide.choiceElement.style.display = 'flex';
            let title = document.createElement('div');
            title.classList.add('choices-menu-title');
            title.innerText = event.title;
            Guide.choiceElement.appendChild(title);
            let buttonContainer = document.createElement('div');
            buttonContainer.classList.add('choices-menu-button-container');
            event.choices.forEach(c => {
              let button = document.createElement('button');
              button.classList.add('btn');
              button.classList.add('btn-primary');
              button.classList.add('choices-menu-button');
              button.innerText = c.text;
              button.addEventListener('click', function() {
                if (c.action) {
                  c.action();
                };
                Guide.choiceElement.innerHTML = '';
                Guide.choiceElement.style.display = 'none';
                nextEvent();
              });
              buttonContainer.appendChild(button);
            });
            Guide.choiceElement.appendChild(buttonContainer);
            break;
          }
        case EventType.ACTION:
          {
            if (event.callback) {
              event.callback(Guide.nextEvent);
            } else {
              nextEvent();
            }
            break;
          }
        case EventType.BACKGROUND:
          {
            if (Guide.backgroundElement.src !== event.src) {
              Guide.backgroundElement.src = event.src;
              /*Guide.backgroundElement.addEventListener('load', function (e) {
                console.log(e);
                nextEvent();
              }, {once: true});*/
              Guide.backgroundElement.onload = function(e) {
                //console.log(e);
                nextEvent();
              };
            }
            break;
          }
        case EventType.INTERACTABILITY:
          {
            Guide.interactable = event.canInteract;
            nextEvent();
          }
          break;
        case EventType.CHARACTERLOADREQUEST:
          {
            let active = Guide.activeCharacters.find(c => c.type === event.characterType);
            if (!active) {
              let characterAnimator = document.createElement('div');
              characterAnimator.classList.add('character-display');
              let characterParent = document.createElement('div');
              characterParent.classList.add('character-parent');
              characterAnimator.appendChild(characterParent);
              Guide.characterParentElement.appendChild(characterAnimator);

              let charImgMap = {};
              let loadedImagesMax = 0;
              let loadedImagesCount = 0;
              function makeCharImg(key, index, display) {
                let character = document.createElement('img');
                character.style.display = display;
                character.classList.add('character-display-img');
                character.src = `char/${event.characterData.identifier}-${event.characterData[key][index]}.png`;
                character.onload = function() {
                  loadedImagesCount++;
                };
                loadedImagesMax++;
                if (!charImgMap[key]) {
                  charImgMap[key] = [];
                };
                charImgMap[key][index] = character;
                characterParent.appendChild(character);
              };

              makeCharImg('resting', 0, 'block');
              event.characterData.talking.forEach((e, i) => {
                makeCharImg('talking', i, 'none');
              });

              Guide.activeCharacters.push({
                type: event.characterType,
                data: event.characterData,
                charImgMap: charImgMap,
                element_characterParent: characterParent,
                element_characterAnimator: characterAnimator,
                hidden: true,
              });

              characterAnimator.style.display = 'none';

              /*function animateCheck() {
                if (loadedImagesCount === loadedImagesMax) {
                  nextEvent();
                } else {
                  requestAnimationFrame(animateCheck);
                }
              };
              animateCheck();*/
            }
            break;
          }
        case EventType.CHARACTER:
          {
            Guide.waitForRendering = true;
            let active = Guide.activeCharacters.find(c => c.type === event.characterType);

            if (active) {
              switch (event.position) {
                case Position.Left:
                  active.element_characterAnimator.style.marginRight = 'auto';
                  break;
                case Position.Right:
                  active.element_characterAnimator.style.marginLeft = 'auto';
                  break;
              };

              let time = 0;
              let animation = [];
              if (event.show) {
                switch (event.animation) {
                  case AnimationType.POP:
                    break;
                  case AnimationType.SLIDE:
                    time = 500;
                    animation = [
                      {
                        transform: event.position === Position.Left ? 'translateX(-100%)' : 'translateX(100%)'
                      },
                      {
                        transform: 'translateX(0)'
                      }
                    ];
                    break;
                  case AnimationType.FADE:
                    break;
                };
                /*characterAnimator.style.display = 'none';
                function animateCheck() {
                  if (loadedImagesCount === loadedImagesMax || (active && active.hidden)) {
                    characterAnimator.style.display = 'block';
                    characterAnimator.animate(animation,
                      {
                        duration: time,
                        iterations: 1,
                      });
                    Guide.waitForRendering = false;
                    nextEvent();
                  } else {
                    requestAnimationFrame(animateCheck);
                  }
                };
                setTimeout(function () {
                  animateCheck();
                }, (active && active.hidden) ? 0 : time * animation.length);*/
                active.element_characterAnimator.style.display = 'block';
                active.element_characterAnimator.animate(animation,
                  {
                    duration: time,
                    iterations: 1,
                  });
                setTimeout(nextEvent, time);
              } else {
                switch (event.animation) {
                  case AnimationType.POP:
                    break;
                  case AnimationType.SLIDE:
                    time = 500;
                    animation = [
                      {
                        transform: 'translateX(0)'
                      },
                      {
                        transform: event.position === Position.Left ? 'translateX(-100%)' : 'translateX(100%)'
                      }
                    ];
                    break;
                  case AnimationType.FADE:
                    break;
                };
                active.element_characterAnimator.animate(animation,
                  {
                    duration: time,
                    iterations: 1,
                  });
                setTimeout(function() {
                  active.element_characterAnimator.style.display = 'none';
                  active.hidden = true;
                  nextEvent();
                }, time);
              }
            }
            break;
          }
        case EventType.SCENETRANSITION:
          {
            Guide.activeTransitionElement.style.display = 'block';
            let animation = [];
            let time = 0;
            switch (event.transition) {
              case SceneTransitionType.CUT:
                break;
              case SceneTransitionType.FADE:
                break;
              case SceneTransitionType.SLIDE_LTR:
              case SceneTransitionType.SLIDE_RTL:
                time = 1000;
                if (event.showTransition) {
                  if (event.transition === SceneTransitionType.SLIDE_LTR) {
                    if (event.autoHide) {
                      Guide.activeTransitionElement.style.left = '-100%';
                    } else {
                      Guide.activeTransitionElement.style.left = '0%';
                    }
                    animation = [
                      {
                        left: '-100%'
                      },
                      {
                        left: '0%'
                      }
                    ];
                  } else {
                    if (event.autoHide) {
                      Guide.activeTransitionElement.style.right = '-100%';
                    } else {
                      Guide.activeTransitionElement.style.right = '0%';
                    }
                    animation = [
                      {
                        right: '-100%'
                      },
                      {
                        right: '0%'
                      }
                    ];
                  }
                } else {
                  if (event.transition === SceneTransitionType.SLIDE_LTR) {
                    if (event.autoHide) {
                      Guide.activeTransitionElement.style.left = '100%';
                    } else {
                      Guide.activeTransitionElement.style.left = '0%';
                    }
                    animation = [
                      {
                        left: '0%'
                      },
                      {
                        left: '100%'
                      }
                    ];
                  } else {
                    if (event.autoHide) {
                      Guide.activeTransitionElement.style.right = '100%';
                    } else {
                      Guide.activeTransitionElement.style.right = '0%';
                    }
                    animation = [
                      {
                        right: '0%'
                      },
                      {
                        right: '100%'
                      }
                    ];
                  }
                }
                break;
            };
            Guide.activeTransitionElement.animate(animation, { duration: time, iterations: 1 });
            setTimeout(function() {
              if (event.clearBoard) {
                Guide.activeCharacters.forEach((e) => {
                  e.element_characterAnimator.style.display = 'none';
                  e.hidden = true;
                });
              };
              if (event.autoHide) {
                Guide.activeTransitionElement.style.display = 'none';
              };
              nextEvent();
            }, time);
            break;
          }
        case EventType.SOUND:
          {
            if (soundMap[event.id]) {
              guidePlayAudioFromId(event.id);
            }
            break;
          }
      };
      if (async === true) {
        Guide.nextEvent();
      }
    };
  },
  nextEvent() {
    //console.log('go to next event', Guide.index);
    if (Guide.index < Guide.events.length - 1) {
      Guide.waitingForNextEvent = true;
      requestAnimationFrame(function() {
        let i = Guide.index + 1;
        Guide.renderEvent(i);
        Guide.waitingForNextEvent = false;
        Guide.index = i;
      });
    }
  },
  lastClickTime: 0,
  click() {
    if (Date.now() - Guide.lastClickTime > 30 && !Guide.waitForRendering && Guide.interactable && !Guide.waitingForNextEvent) {
      Guide.lastClickTime = Date.now();
      if (Guide.isFinishedTyping) {
        Guide.nextEvent();
      } else {
        Guide.userRequestSkipToEnd = true;
      }
    }
  }
};
class Dialog {
  constructor(text, character, dialogType = 0) {
    this.type = EventType.DIALOG;
    this.text = text;
    this.character = character;
    this.dialogType = dialogType;
  }
};
class Choice {
  constructor(title, choices) {
    this.type = EventType.CHOICE;
    this.title = title;
    this.choices = choices;
  }
};
class Action {
  constructor(callback) {
    this.type = EventType.ACTION;
    this.callback = callback;
  }
}
class Character {
  constructor(show, characterType, position, animation = Animation.FADE) {
    this.type = EventType.CHARACTER;
    this.show = show;
    this.characterType = characterType;
    this.position = position;
    this.animation = animation;
  }
}
class CharacterAnimation {
  constructor(callback) {
    this.type = EventType.ACTION;
    this.callback = callback;
  }
}
class CharacterLoadRequest {
  constructor(characterType, characterData) {
    this.type = EventType.CHARACTERLOADREQUEST;
    this.characterType = characterType;
    this.characterData = characterData;
  }
}
class Background {
  constructor(src) {
    this.type = EventType.BACKGROUND;
    this.src = 'bg/' + src;
  }
}
class Interactability {
  constructor(canInteract) {
    this.type = EventType.INTERACTABILITY;
    this.canInteract = canInteract;
  }
}
class SceneTransition {
  constructor(clearBoard, showTransition, transition, autoHide = true) {
    this.type = EventType.SCENETRANSITION;
    this.clearBoard = clearBoard;
    this.showTransition = showTransition;
    this.transition = transition;
    this.autoHide = autoHide;
  }
}
class PreloadAssets {
  constructor() {
    this.type = EventType.PRELOADASSETS;
  }
}
class Sound {
  constructor(id, looping, audios, start, end) {
    this.type = EventType.SOUND;
    this.id = id;
    this.looping = looping;
    this.audios = audios;
    this.start = start;
    this.end = end;
  }
}
class ScreenEffect {
  constructor(effectType) {
    this.type = EventType.SCREENEFFECT;
    this.effect = effectType;
  }
}

Guide.setup();