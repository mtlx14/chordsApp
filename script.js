import { songsDb } from './songsDb.js';
import { keysDb } from './keysDb.js';
const scaleNotes = [
  ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'],
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
];
const completeNotesToFind = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C'];
const chordScale = {
  C: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bm'],
  'C#': ['C#', 'D#m', 'E#m', 'F#', 'G#', 'A#m', 'B#m'],
  D: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#m'],
  'D#': ['D#', 'Fm', 'Gm', 'G#', 'A#', 'Cm', 'Dm'],
  E: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#m'],
  F: ['F', 'Gm', 'Am', 'A#', 'C', 'Dm', 'Em'],
  'F#': ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'Fm'],
  G: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#m'],
  'G#': ['G#', 'A#m', 'Cm', 'C#', 'D#', 'Fm', 'Gm'],
  A: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#m'],
  'A#': ['A#', 'Cm', 'Dm', 'D#', 'F', 'Gm', 'Am'],
  B: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#m'],
};
const minorToMayor = {
  Minor: ['Am', 'A#m', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'],
  Mayor: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
};

const normalize = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const songsDB = songsDb;
const keysDB = keysDb;

const mainOptions = {
  americanScale: true,
  songOpen: false,
  keySelected: 'E',
  minor: false,
  longText: false,
  pinedSongs: [0],
  recentSongs: [1],
  pinedSongsOpen: true,
  recentSongsOpen: true,
};

const getLocalStorage = () => {
  let americanScaleStorage = JSON.parse(localStorage.getItem('american_scale'));
  if (americanScaleStorage != null) mainOptions.americanScale = americanScaleStorage;
  let songOpenStorage = JSON.parse(localStorage.getItem('song_open'));
  if (songOpenStorage != null) mainOptions.songOpen = songOpenStorage;
  if (typeof mainOptions.songOpen == 'string') mainOptions.songOpen = parseInt(mainOptions.songOpen);
  let keySelectedStorage = JSON.parse(localStorage.getItem('key_selected'));
  if (keySelectedStorage != null) mainOptions.keySelected = keySelectedStorage;
  let minorStorage = JSON.parse(localStorage.getItem('minor'));
  if (minorStorage != null) mainOptions.minor = minorStorage;
  let longTextStorage = JSON.parse(localStorage.getItem('long_text'));
  if (longTextStorage != null) mainOptions.longText = longTextStorage;
  let pinedSongsStorage = JSON.parse(localStorage.getItem('pined_songs'));
  if (pinedSongsStorage != null) mainOptions.pinedSongs = pinedSongsStorage;
  let recentSongsStorage = JSON.parse(localStorage.getItem('recent_songs'));
  if (recentSongsStorage != null) mainOptions.recentSongs = recentSongsStorage;
  let pinedSongsOpenStorage = JSON.parse(localStorage.getItem('pined_songs_open'));
  if (pinedSongsOpenStorage != null) mainOptions.pinedSongsOpen = pinedSongsOpenStorage;
  let recentSongsOpenStorage = JSON.parse(localStorage.getItem('recent_songs_open'));
  if (recentSongsOpenStorage != null) mainOptions.recentSongsOpen = recentSongsOpenStorage;

  mainOptions.recentSongs = [...new Set(mainOptions.recentSongs)];
};
const setLocalStorage = ({ ae, so, ks, m, lt, ps, rs, pso, rso }) => {
  if (ae) localStorage.setItem('american_scale', JSON.stringify(mainOptions.americanScale));
  if (so) localStorage.setItem('song_open', JSON.stringify(mainOptions.songOpen));
  if (ks) localStorage.setItem('key_selected', JSON.stringify(mainOptions.keySelected));
  if (m) localStorage.setItem('minor', JSON.stringify(mainOptions.minor));
  if (lt) localStorage.setItem('long_text', JSON.stringify(mainOptions.longText));
  if (ps) localStorage.setItem('pined_songs', JSON.stringify(mainOptions.pinedSongs));
  if (rs) localStorage.setItem('recent_songs', JSON.stringify(mainOptions.recentSongs));
  if (pso) localStorage.setItem('pined_songs_open', JSON.stringify(mainOptions.pinedSongsOpen));
  if (rso) localStorage.setItem('recent_songs_open', JSON.stringify(mainOptions.recentSongsOpen));
};

const keyNotation = (notation, note) => {
  if (note == '-') return note;
  if (notation == true) {
    return note;
  } else {
    if (note.length == 1) {
      return scaleNotes[0][[scaleNotes[1].indexOf(note)]];
    } else {
      const part1 = note.substring(0, 1);
      const part2 = note.substring(1);
      return scaleNotes[0][[scaleNotes[1].indexOf(part1)]] + part2;
    }
  }
};
const keyColor = (type) => {
  let classReturn = 'a';
  if (type == 'key') {
    classReturn = 'typeKey';
  } else if (type == 'favorite') {
    classReturn = 'typeFavorite';
  } else if (type == 'recent') {
    classReturn = 'typeRecent';
  }
  return classReturn;
};
const getChordType = (chord) => {
  if (chord == 0) return 'base';
  if (chord == 1) return 'chordSeparator';
};
const getChord = (key, chord) => {
  if (chord == '-') {
    return chord;
  }
  return chordScale[key][chord - 1];
};
const getSpaces = (cant) => {
  const space = '\xa0';
  let spacesReturn = '';
  for (let i = 0; i < cant; i++) {
    spacesReturn += space;
  }
  return spacesReturn;
};

document.addEventListener('DOMContentLoaded', () => {
  getLocalStorage();
  // localStorage.removeItem('recent_songs');
  // localStorage.removeItem('pined_songs');
  const mainFrame = document.querySelector('.mainFrame');
  const mainFrameLeft = document.querySelector('.mainFrameLeft');
  const mainFrameRight = document.querySelector('.mainFrameRight');
  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  mainFrame.style.height = `${window.innerHeight}px`;

  const keyNotationClick = document.getElementById('keyNotationClick');
  keyNotationClick.addEventListener('click', () => {
    if (mainOptions.americanScale == true) {
      keyNotationClick.classList.remove('americanScaleTrue');
      mainOptions.americanScale = false;
    } else {
      keyNotationClick.classList.add('americanScaleTrue');
      mainOptions.americanScale = true;
    }
    renderSongsList('principal');
    setLocalStorage({ ae: true });
  });
  const renderKeyNotationClick = () => {
    if (mainOptions['americanScale'] == true) {
      keyNotationClick.classList.add('americanScaleTrue');
    } else {
      keyNotationClick.classList.remove('americanScaleTrue');
    }
  };

  const backToListFromSearch = document.getElementById('backToListFromSearch');
  const backToListFromSearchEvent = () => {
    backToListFromSearch.focus();
    mainFrameLeft.querySelector('.searchFrame input').blur();
    itemSongsCardContainerSearch.style.display = 'none';
    backToListFromSearch.style.display = 'none';
    mainFrameLeft.querySelector('.searchFrame input').value = '';
    // renderSongsList('principal');
  };

  backToListFromSearch.addEventListener('click', () => {
    backToListFromSearchEvent();
    renderSongsList('principal');
  });

  // ------------------------------------------------------------------------------

  const openSongClick = (clickFrom, songID, key) => {
    mainOptions.songOpen = parseInt(songID);
    mainOptions.keySelected = key;
    key.substring(key.length - 1) == 'm' ? (mainOptions.minor = true) : (mainOptions.minor = false);

    key.substring(key.length - 1) == 'm'
      ? (mainOptions.keySelected =
          minorToMayor['Mayor'][
            minorToMayor['Minor'].indexOf(
              minorToMayor['Minor'].find((a) => {
                return a == key;
              })
            )
          ])
      : (mainOptions.keySelected = key);

    mainFrameLeft.style.left = '-100vw';
    mainFrameRight.style.left = '-100vw';
    setLocalStorage({ so: true, ks: true, m: true });
  };
  const backToListClick = () => {
    mainOptions.songOpen = false;
    backToListFromSearchEvent();
    renderSongsList('principal');

    mainFrameLeft.style.left = '0vw';
    mainFrameRight.style.left = '0vw';
    setLocalStorage({ so: true });
  };
  const renderOpenSong = (a) => {
    if (a !== false) {
      mainFrameLeft.style.left = '-100vw';
      mainFrameRight.style.left = '-100vw';
    } else {
      mainFrameLeft.style.left = '0vw';
      mainFrameRight.style.left = '0vw';
    }
  };
  // left Frame--------------------------------------------------------
  // ------------------------------------------------------------------------------
  const itemSongsCardContainerRecents = document.querySelector('.songsContainerRecents');
  const itemSongsCardContainerPined = document.querySelector('.songsContainerPined');
  const itemSongsCardContainerSearch = document.querySelector('.songsContainerSearch');
  const itemSongCardTemplate = document.querySelector('.item_songCard_template').content;

  let songsToPrintSearchList = [];

  const renderSongsList = (renderType, newItemRender) => {
    mainOptions.recentSongs = mainOptions.recentSongs.slice(0, 5);
    let containerRender = '';
    let songsToRender = '';
    let slideText1 = '';
    let slideText2 = '';

    const renderNumber = renderType == 'principal' ? 2 : 1;

    for (let k = 0; k < renderNumber; k++) {
      if (renderType == 'principal') {
        setTimeout(() => {
          backToListFromSearch.parentElement.parentElement.style.marginBottom = '0px';
        }, 1);
        if (k == 0) {
          containerRender = itemSongsCardContainerPined;
          songsToRender = mainOptions.pinedSongs;
          slideText1 = 'Deslizar para eliminar';
          slideText2 = 'Canción eliminada';
          containerRender.innerHTML = '<p class="songsListHeader">Fijadas</p>';

          if (songsToRender.length > 0) {
            if (mainOptions.pinedSongsOpen == true) {
              itemSongsCardContainerPined.querySelector('.songsListHeader').style.height = '25px';
            } else {
              itemSongsCardContainerPined.querySelector('.songsListHeader').style.height = '0px';
              setTimeout(() => {
                itemSongsCardContainerPined.querySelector('.songsListHeader').style.height = '25px';
              }, 10);
            }
            itemSongsCardContainerPined.style.display = 'block';
          }
        } else {
          containerRender = itemSongsCardContainerRecents;
          songsToRender = mainOptions.recentSongs;
          slideText1 = 'Deslizar para fijar';
          slideText2 = 'Canción fijada';
          containerRender.innerHTML = '<p class="songsListHeader">Recientes</p>';

          if (songsToRender.length > 0) {
            if (mainOptions.recentSongsOpen == true) {
              itemSongsCardContainerRecents.querySelector('.songsListHeader').style.height = '25px';
            } else {
              itemSongsCardContainerRecents.querySelector('.songsListHeader').style.height = '0px';
              setTimeout(() => {
                itemSongsCardContainerRecents.querySelector('.songsListHeader').style.height = '25px';
              }, 10);
            }
            itemSongsCardContainerRecents.style.display = 'block';
          }
        }
      } else {
        containerRender = itemSongsCardContainerSearch;
        songsToRender = songsToPrintSearchList;
        containerRender.innerHTML = '<p class="songsListHeader">Resultados:</p>';
        slideText1 = 'Deslizar para fijar';
        slideText2 = 'Canción fijada';
        itemSongsCardContainerSearch.querySelector('.songsListHeader').style.height = '25px';
      }

      mainOptions.songOpen !== false ? containerRender.classList.add('songOpen') : containerRender.classList.remove('songOpen');

      for (let i = 0; i < songsToRender.length; i++) {
        const clone = itemSongCardTemplate.cloneNode(true);

        clone.querySelector('.item_songCard').id = songsDB[songsToRender[i]]['id'];
        clone.querySelector('.title').textContent = songsDB[songsToRender[i]]['title'];
        clone.querySelector('.artist').textContent = songsDB[songsToRender[i]]['artist'];

        if (mainOptions.pinedSongs.includes(songsDB[songsToRender[i]]['id'])) {
          clone.querySelector('.item_songCard .pinedIcon').classList.add('pinedIconActive');
        }

        const keysContainer = clone.querySelector('.keysContainer');
        const keysTemplates = clone.querySelector('.keysTemplate').content;

        const keysToPrint = keysDB.filter((item) => item.song_id == songsDB[songsToRender[i]]['id']);

        if (i == songsToRender.length - 1) {
          clone.querySelector('.item_songCardContainer').style.marginBottom = '20px';
        }

        for (let j = 0; j < keysToPrint.length; j++) {
          const clone2 = keysTemplates.cloneNode(true);
          clone2.querySelector('.textNote').textContent = keyNotation(mainOptions.americanScale, keysToPrint[j]['key']);
          clone2.querySelector('.note').classList.add(`${keyColor(keysToPrint[j]['type'])}`);
          clone2.querySelector('.note').value = keysToPrint[j]['key'];

          clone2.querySelector('.note').addEventListener('click', (e) => {
            let idSongOpen = e.target.parentNode.parentNode.parentNode.id;

            if (!mainOptions.pinedSongs.includes(parseInt(idSongOpen)) && !mainOptions.recentSongs.includes(parseInt(idSongOpen))) {
              mainOptions.recentSongs.unshift(parseInt(idSongOpen));
            }
            openSongClick('key', idSongOpen, e.target.value);
            renderSongFrameRight();
            renderOptionsTopFrameRight();
            setLocalStorage({ rso: true });
          });
          keysContainer.append(clone2);
        }
        containerRender.appendChild(clone);
      }
      if ((newItemRender == 'pined' && k == 0 && mainOptions.pinedSongs.length > 0) || (newItemRender == 'recent' && k == 1 && mainOptions.recentSongs.length > 0)) {
        let lastRender = '';
        if (newItemRender == 'pined') {
          lastRender = containerRender.lastElementChild;
        } else {
          lastRender = containerRender.querySelector('.item_songCardContainer');
        }
        lastRender.style.height = '0px';
        setTimeout(() => {
          lastRender.style.height = '90px';
        }, 30);
      }
      containerRender.querySelectorAll('.item_songCardContainer .item_songCardContainerScroll').forEach((element) => {
        element.querySelector('.addToSnipedListFrame1 .textCenter p').textContent = slideText1;
        element.querySelector('.addToSnipedListFrame2 .textCenter p').textContent = slideText2;
        let execute = true;
        let newItemOn = '';

        element.addEventListener('scroll', (e) => {
          const activateScroll = e.target.querySelector('.item_songCard').getBoundingClientRect().left;
          if (activateScroll < -300 && execute == true) {
            if (element.parentElement.parentElement.classList.contains('songsContainerRecents')) {
              if (mainOptions.pinedSongs.indexOf(parseInt(element.querySelector('.item_songCard').id)) == -1) {
                mainOptions.pinedSongs.push(parseInt(element.querySelector('.item_songCard').id));
                mainOptions.recentSongs.splice(mainOptions.recentSongs.indexOf(parseInt(element.querySelector('.item_songCard').id)), 1);

                newItemOn = 'pined';
              }
            } else if (element.parentElement.parentElement.classList.contains('songsContainerPined')) {
              mainOptions.pinedSongs.splice(mainOptions.pinedSongs.indexOf(parseInt(element.querySelector('.item_songCard').id)), 1);
              mainOptions.recentSongs.unshift(parseInt(element.querySelector('.item_songCard').id));
              newItemOn = 'recent';
            } else if (element.parentElement.parentElement.classList.contains('songsContainerSearch')) {
              mainOptions.pinedSongs.push(parseInt(element.querySelector('.item_songCard').id));
              if (mainOptions.recentSongs.indexOf(parseInt(element.querySelector('.item_songCard').id)) != -1) {
                mainOptions.recentSongs.splice(mainOptions.recentSongs.indexOf(parseInt(element.querySelector('.item_songCard').id)), 1);
              }

              setTimeout(() => {
                backToListFromSearchEvent();
              }, 800);
            }
            execute = false;
            element.querySelector('.addToSnipedListFrame1 .textCenter').style.opacity = 0;
            setTimeout(() => {
              element.querySelector('.addToSnipedListFrame2 .textCenter').style.opacity = 1;
            }, 50);

            setTimeout(() => {
              element.parentElement.style.height = '0px';
              element.querySelector('.addToSnipedListFrame2 .textCenter').style.opacity = 0;
              if (mainOptions.recentSongs.length < 1 && newItemOn == 'pined') {
                itemSongsCardContainerRecents.querySelector('.songsListHeader').style.height = '0px';
                itemSongsCardContainerRecents.querySelector('.item_songCardContainer').style.marginBottom = '0px';
              }
              if (mainOptions.pinedSongs.length < 1 && newItemOn == 'recent') {
                itemSongsCardContainerPined.querySelector('.songsListHeader').style.height = '0px';
                itemSongsCardContainerPined.querySelector('.item_songCardContainer').style.marginBottom = '0px';
              }
            }, 500);
            setTimeout(() => {
              renderSongsList('principal', newItemOn);
            }, 1000);
          }
        });
      });
    }
    mainOptions.pinedSongs.length > 0 ? (mainOptions.pinedSongsOpen = true) : (mainOptions.pinedSongsOpen = false);
    mainOptions.recentSongs.length > 0 ? (mainOptions.recentSongsOpen = true) : (mainOptions.recentSongsOpen = false);
    setLocalStorage({ ps: true, rs: true, pso: true, rso: true });
  };

  // search bar--------------------------------------------------------

  const searchFrameInput = mainFrameLeft.querySelector('.searchFrame input');

  searchFrameInput.addEventListener('input', () => {
    backToListFromSearch.style.display = 'flex';
    itemSongsCardContainerSearch.style.display = 'block';
    setTimeout(() => {
      backToListFromSearch.parentElement.parentElement.style.marginBottom = '10px';
    }, 1);
    songsToPrintSearchList = [];
    itemSongsCardContainerRecents.style.display = 'none';
    itemSongsCardContainerPined.style.display = 'none';
    itemSongsCardContainerSearch.innerHTML = '';
    let search = normalize(searchFrameInput.value);

    let songsByName = songsDB.filter((itemA) => normalize(itemA.title).includes(search));
    const songsByArtist = songsDB.filter((itemA) => normalize(itemA.artist).includes(search));
    const songsByLyrics = songsDB.filter((itemA) => {
      return itemA.lyrics?.some((line) => normalize(line).includes(search)) || itemA.compact_lyrics?.some((line) => normalize(line).includes(search));
    });

    for (let i = 0; i < songsByName.length; i++) {
      songsToPrintSearchList.push(songsByName[i].id);
    }

    for (let i = 0; i < songsByArtist.length; i++) {
      if (
        !songsToPrintSearchList.find((item) => {
          return item == songsByArtist[i].id;
        })
      ) {
        songsToPrintSearchList.push(songsByArtist[i].id);
      }
    }
    for (let i = 0; i < songsByLyrics.length; i++) {
      if (
        !songsToPrintSearchList.find((item) => {
          return item == songsByLyrics[i].id;
        })
      ) {
        songsToPrintSearchList.push(songsByLyrics[i].id);
      }
    }
    renderSongsList('search');
  });

  // right Frame--------------------------------------------------------

  const backToListaButton = mainFrameRight.querySelector('.optionsTop .back');
  backToListaButton.addEventListener('click', () => {
    backToListClick();
  });
  const optionsTop = mainFrameRight.querySelector('.optionsTop');
  const textLongOption = optionsTop.querySelector('.selectTextLong');
  textLongOption.addEventListener('click', () => {
    if (mainOptions.longText == false) {
      mainOptions.longText = true;
    } else {
      mainOptions.longText = false;
    }
    renderOptionsTopFrameRight();
    renderSongFrameRight();
    setLocalStorage({ lt: true });
  });
  const renderOptionsTopFrameRight = () => {
    if (mainOptions.longText == false) {
      textLongOption.querySelector('.textS').classList.add('selected');
      textLongOption.querySelector('.textL').classList.remove('selected');
      textLongOption.querySelector('.togle').style.left = 0;
    } else {
      textLongOption.querySelector('.textL').classList.add('selected');
      textLongOption.querySelector('.textS').classList.remove('selected');
      textLongOption.querySelector('.togle').style.left = '1.6rem';
    }
  };
  const renderSongFrameRight = () => {
    if (mainOptions.songOpen !== false) {
      const songFrame = mainFrameRight.querySelector('.songFrame');
      songFrame.style.height = `calc(${window.innerHeight}px - 6.8rem)`;
      mainFrameRight.querySelector('.titleSong').textContent = songsDB[mainOptions.songOpen]['title'];
      songFrame.innerHTML = '';

      let lyricsToPrint = '';
      let chordsToPrint = '';
      if (mainOptions.longText == false) {
        lyricsToPrint = songsDB[mainOptions.songOpen]['compact_lyrics'];
        chordsToPrint = songsDB[mainOptions.songOpen]['compact_chords'];
      } else {
        lyricsToPrint = songsDB[mainOptions.songOpen]['lyrics'];
        chordsToPrint = songsDB[mainOptions.songOpen]['chords'];
      }

      for (let i = 0; i < 100 + songsDB[mainOptions.songOpen]['lyrics'].length + songsDB[mainOptions.songOpen]['chords'].length; i++) {
        const lyricLine = lyricsToPrint.find((a) => {
          return a.substring(0, 3) == i;
        });

        if (lyricLine) {
          songFrame.innerHTML += `<p class="lyricsLine lyricsLine${i}">${'\xa0'} ${lyricLine.substring(6)}</p>`;
          if (lyricLine.substring(4, 5) == 1) {
            songFrame.querySelector(`.lyricsLine${i}`).classList.add('indexLine');
          }
        } else {
          const chordThisLine = chordsToPrint.filter((data) => data.substring(0, 3) == i);

          for (let j = 0; j < chordThisLine.length; j++) {
            if (j == 0) {
              songFrame.innerHTML += `<div class="chordLine chordLine${i}"></div>`;
            }
            songFrame.querySelector(`.chordLine${i}`).innerHTML += `<p class='${getChordType(chordThisLine[j].substring(4, 5))} chord${j}'></p>`;
            songFrame.querySelector(`.chordLine${i} .chord${j}`).textContent = `${getSpaces(chordThisLine[j].substring(6, 8))}`;
            if (chordThisLine[j] != undefined && chordThisLine[j].length > 11) {
              let keyToPrint = '';
              let addm = '';
              let keyIndex = completeNotesToFind.indexOf(mainOptions.keySelected);

              keyToPrint = chordThisLine[j].substring(10, chordThisLine[j].length);

              if (keyToPrint.substring(2, 3) == 'm') addm = 'm';
              if (keyToPrint.substring(2, 3) == '7') addm = '7';
              if (keyToPrint.substring(2, 3) == 'n') addm = 'm7';
              keyToPrint = completeNotesToFind[keyIndex + parseInt(keyToPrint.substring(0, 2))];

              keyToPrint = keyToPrint + addm;

              if (chordThisLine[j].length > 13) {
                let keyToPrint2 = '';
                let addm2 = '';
                keyToPrint2 = chordThisLine[j].substring(14, chordThisLine[j].length);

                if (keyToPrint2.substring(2, 3) == 'm') addm2 = 'm';
                if (keyToPrint2.substring(2, 3) == '7') addm2 = '7';
                if (keyToPrint2.substring(2, 3) == 'n') addm2 = 'm7';
                keyToPrint2 = completeNotesToFind[keyIndex + parseInt(keyToPrint2.substring(0, 2))];

                keyToPrint2 = '/' + keyToPrint2 + addm2;
                keyToPrint = keyToPrint + keyToPrint2;
              }

              songFrame.querySelector(`.chordLine${i} .chord${j}`).textContent += ` ${keyNotation(mainOptions.americanScale, keyToPrint)}`;
            } else {
              songFrame.querySelector(`.chordLine${i} .chord${j}`).textContent += ` ${keyNotation(mainOptions.americanScale, getChord(mainOptions.keySelected, chordThisLine[j].substring(10, 11)))}`;
            }
          }
        }
        if (mainOptions.longText == true) {
          if (i == songsDB[mainOptions.songOpen]['lyrics'].length + songsDB[mainOptions.songOpen]['chords'].length - 1) {
            for (let i = 0; i < 8; i++) {
              songFrame.innerHTML += `<p class="lyricsLine emptyLine">\xa0</p>`;
            }
          }
        }
      }

      songFrame.querySelectorAll('.indexLine').forEach((item) => {
        item.addEventListener('click', () => {
          let findingLine = item.nextElementSibling;
          let currentNote = '';
          while (true) {
            if (findingLine.classList.contains('chordLine')) {
              currentNote = findingLine.querySelector('.chord0').textContent;
              if (currentNote.substring(currentNote.length - 1) == '#') {
                currentNote = currentNote.substring(currentNote.length - 2);
              } else {
                if (currentNote.substring(currentNote.length - 1) == 'm') {
                  currentNote = currentNote.substring(currentNote.length - 3);
                } else {
                  currentNote = currentNote.substring(currentNote.length - 1);
                }
              }

              break;
            }
            findingLine = findingLine.nextSibling;
          }
          currentNote = chordScale[mainOptions.keySelected].indexOf(currentNote) + 1;
          keyFrameSelectOpen(currentNote);
        });
      });

      const keyFrame = mainFrameRight.querySelector('.keyFrame');
      keyFrame.querySelector('.textContainer2 .keyMayor').textContent = mainOptions.keySelected;
      keyFrame.querySelector('.textContainer2 .keyMenor').textContent = minorToMayor['Minor'][minorToMayor['Mayor'].indexOf(mainOptions.keySelected)];
      if (songsDB[mainOptions.songOpen]['minor'] == false) {
        keyFrame.querySelector('.textContainer2 .keyMayor').classList.add('keySelected');
        keyFrame.querySelector('.textContainer2 .keyMenor').classList.remove('keySelected');
      } else {
        keyFrame.querySelector('.textContainer2 .keyMenor').classList.add('keySelected');
        keyFrame.querySelector('.textContainer2 .keyMayor').classList.remove('keySelected');
      }
      const popupKeySelect = document.querySelector('.popupKeySelect');
      const rowTemplate = document.querySelector('.popupKeySelectRowTemplate').content;

      const keyFrameSelectOpen = (currentNoteOpen) => {
        keyFrame.querySelector('.textContainer1').style.borderBottomLeftRadius = 0;
        keyFrame.querySelector('.textContainer2').style.borderBottomRightRadius = 0;

        // popupKeySelect.style.top = `${keyFrame.getBoundingClientRect().bottom - 1}px`;
        popupKeySelect.innerHTML = '';

        for (let i = 0; i < minorToMayor['Minor'].length; i++) {
          const clone = rowTemplate.cloneNode(true);
          clone.querySelector('.text1').textContent = minorToMayor['Mayor'][i];
          clone.querySelector('.text2').textContent = minorToMayor['Minor'][i];

          if (i == 0) {
            clone.querySelector('.row').style.borderTopRightRadius = '10px';
          }
          if (i == minorToMayor['Minor'].length - 1) {
            clone.querySelector('.row').style.borderBottomRightRadius = '10px';
            clone.querySelector('.row').style.borderBottomLeftRadius = '10px';
          }
          if (i % 2 == 1) {
            clone.querySelector('.row').style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
          }

          if (clone.querySelector('.text1').textContent == mainOptions.keySelected) {
            clone.querySelector('.row').classList.add('selected');
          }

          clone.querySelector('.row').addEventListener('click', (e) => {
            mainOptions.keySelected = e.target.querySelector('.text1').textContent;

            renderSongFrameRight();
            closepopupKeySelector();
            setLocalStorage({ ks: true });
          });

          popupKeySelect.appendChild(clone);
        }
        if (currentNoteOpen) {
          popupKeySelect.style.width = '15rem';
          popupKeySelect.querySelectorAll('.row').forEach((a) => {
            a.style.width = '15rem';
            a.querySelector('.text3').style.display = 'block';
            a.querySelector('.text3').textContent = chordScale[a.querySelector('.text1').textContent][currentNoteOpen - 1];
          });
          document.querySelector('.popupKeySelectActiveIndicator').style.width = '17.2rem';
        } else {
          popupKeySelect.style.width = '10rem';
          popupKeySelect.querySelectorAll('.row').forEach((a) => {
            a.style.width = '10rem';
          });
          document.querySelector('.popupKeySelectActiveIndicator').style.width = '12.2rem';
        }

        popupKeySelect.style.height = `calc(${minorToMayor['Minor'].length * 2.2}rem)`;
        popupKeySelect.style.opacity = 1;
        popupKeySelect.style.backdropFilter = 'blur(6px)';

        document.querySelector('.popupKeySelectActiveIndicator').style.height = '2.2rem';
        document.querySelector('.popupKeySelectActiveIndicator').style.opacity = 1;
        document.querySelector('.popupKeySelectActiveIndicator .imgContainer').style.backdropFilter = '0rem';

        document.querySelector('.popupKeySelectActiveIndicator').style.top = `${popupKeySelect.querySelector('.selected').getBoundingClientRect().top}px`;
        setTimeout(() => {
          document.querySelector('.popupKeySelectActiveIndicator img').style.right = '0rem';
        }, '200');
        document.querySelector('.closepopupKeySelector').style.display = 'block';

        const closepopupKeySelector = () => {
          document.querySelector('.closepopupKeySelector').style.display = 'none';
          popupKeySelect.style.height = 0;

          document.querySelector('.popupKeySelectActiveIndicator').style.opacity = 0;
          document.querySelector('.popupKeySelectActiveIndicator').style.height = '0rem';

          document.querySelector('.popupKeySelectActiveIndicator').style.transition = 'unset';
          keyFrame.querySelector('.textContainer1').style.borderBottomLeftRadius = '0.3rem';
          keyFrame.querySelector('.textContainer2').style.borderBottomRightRadius = '0.3rem';
          setTimeout(() => {
            document.querySelector('.popupKeySelectActiveIndicator').style.transition = 'opacity 0.5s ease';
            document.querySelector('.popupKeySelectActiveIndicator img').style.right = '-2.2rem';
          }, '10');
        };
        document.querySelector('.closepopupKeySelector').addEventListener('click', () => {
          closepopupKeySelector();
        });
      };
      keyFrame.addEventListener('click', () => {
        keyFrameSelectOpen();
      });

      const switchSongFrame = document.querySelector('.switchSongFrame');
      const templateKeySwitchSongFrame = document.querySelector('.templateKeySwitchSongFrame').content;
      let songToWriteInSwitchSongFrame = 0;
      if (mainOptions.pinedSongs.length > 1 && mainOptions.pinedSongs.includes(parseInt(mainOptions.songOpen))) {
        songToWriteInSwitchSongFrame = mainOptions.pinedSongs[mainOptions.pinedSongs.indexOf(mainOptions.songOpen) + 1];
        if (songToWriteInSwitchSongFrame == undefined) songToWriteInSwitchSongFrame = mainOptions.pinedSongs[0];

        switchSongFrame.querySelector('.title').textContent = songsDB[songToWriteInSwitchSongFrame].title;
        switchSongFrame.querySelector('.artist').textContent = songsDB[songToWriteInSwitchSongFrame].artist;

        let keysToPrint = keysDB.filter((item) => {
          return item.song_id == songToWriteInSwitchSongFrame;
        });

        switchSongFrame.querySelector('.keys').innerHTML = '';
        for (let i = 0; i < keysToPrint.length && i < 3; i++) {
          let clone = templateKeySwitchSongFrame.cloneNode(true);
          clone.querySelector('p').textContent = keysToPrint[i].key;
          if (keysToPrint[i].type == 'key') clone.querySelector('.key_type').classList.add('typeKey');
          if (keysToPrint[i].type == 'favorite') clone.querySelector('.key_type').classList.add('typeFavorite');
          if (keysToPrint[i].type == 'recent') clone.querySelector('.key_type').classList.add('typeRecent');
          switchSongFrame.querySelector('.keys').appendChild(clone);
        }

        switchSongFrame.style.display = 'flex';

        switchSongFrame.querySelectorAll('.key_type').forEach((item) => {
          item.addEventListener('click', () => {
            openSongClick(true, songToWriteInSwitchSongFrame, item.querySelector('p').textContent);

            renderSongFrameRight();
          });
        });
      } else {
        switchSongFrame.style.display = 'none';
      }
    }
  };
  renderOpenSong(mainOptions.songOpen); //canción abierta o cerrada
  renderKeyNotationClick(); //botón de selección de nota
  renderSongsList('principal'); //lista de canciones

  // !----------------
  // borrar!!!!! esto se debe ejecutar al clickear cancion
  renderSongFrameRight();
  renderOptionsTopFrameRight();
  // !----------------

  // ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------

  document.querySelector('.buttonStats').addEventListener('click', () => {
    console.log(mainOptions);
  });
});
