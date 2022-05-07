/**
 * dynamically imported if game dependencies load
 * load.js adds window.fuse to pass across modules (hacky)
 */

/*********************************************************
globals
*********************************************************/

// answer could be extracted using folder name to filter data.json
// to strip non-alphanumeric characters use this (doesnt strip underscores)
// .replace(/\W/g, '')

// answers
const answer = ['The Gang Sells Out', 'The Gang Gets Invincible'][0];

// set guess state
let guess = 1;

// set total guesses
const totalGuesses = 6;

// get commonly updated elements
const resultsList = document.getElementById('results');

const guesses = document.getElementById('guesses');

const search = document.getElementById('search');

/*********************************************************
functions
*********************************************************/

// handle search input change
const fuseSearch = e => {
  // assign user pattern
  const pattern = e.target.value;

  // get full results
  const results = fuse.search(pattern);

  // get list of titles from full results set
  // limit to top 50 results (useful or misleading?)
  const episodes = results.slice(0, 50).map(result => result.item.title);

  // show results back to user
  showResults(episodes);
};

const showResults = results => {
  // first wipe old results
  // replaces all child elements with a single empty text node
  resultsList.textContent = '';

  resultsList.insertAdjacentHTML(
    'beforeend',
    `<li class="result">${
      Array.isArray(results) ? results.join('</li><li class="result">') : results
    }</li>`
  );
};

// show current frame
const showFrame = number => {
  document.getElementById('frame').src = `../data/img/${answer}/${number}.png`;
};

// increment guess counter
const addGuess = () => {
  // remember 'guess' and 'guesses' are globals

  // remove current class from previous guess
  guesses.lastElementChild.classList.remove('current');

  // add new current guess number
  guesses.insertAdjacentHTML(
    'beforeend',
    `<span class="current">${guess}</span>`
  );
};

// remove a selected guess by using the click event
const removeGuess = selectionEvent => {
  // removes a document from the data global
  // https://fusejs.io/api/methods.html#remove

  // get selection item
  const item = fuse.search(selectionEvent.target.textContent)[0].item;

  // remove selection item from fuse search and data.json variable
  fuse.remove(doc => doc === item);

  // remove selection from results list to help avoid double-removal error
  selectionEvent.target.remove();
};

const endGame = () => {
  // wipe results
  resultsList.textContent = '';

  // remove old search value
  search.value = '';

  // prevent more searching
  search.style.pointerEvents = 'none';
};

const logGuess = (state, selection) => {
  // uses guess global to find correct log row
  document.querySelectorAll('.state')[guess - 1].textContent = `${state}`;
  document.querySelectorAll('.selection')[
    guess - 1
  ].textContent = `${selection}`;
};

// purely UI function to see older frames
const toggleFrames = e => {
  if (e.target.tagName.toLowerCase() === 'span') {
    // map over nodelist to remove old toggle class
    Array.from(e.target.parentElement.children, elm =>
      elm.classList.remove('toggled')
    );

    // add current toggled guess
    e.target.classList.add('toggled');

    // show relevant frame
    showFrame(e.target.textContent);
  }
};

// show game state message
const stateMsg = msg => {
  document.getElementById('state').textContent =
    msg ||
    `${totalGuesses - (guess - 1)} ${
      totalGuesses - (guess - 1) === 1 ? 'guess' : 'guesses'
    } remaining`;
};

// handle clicks on results list
// this function drives game state changes
const selectResult = e => {
  // detect dynamically added result events
  if (e.target.classList.contains('result')) {
    // prevent double-removal error by making unclickable
    e.target.style.pointerEvents = 'none';

    const selection = e.target.textContent;

    // remove previous guess from fuse search
    removeGuess(e);

    if (selection === answer) {
      // console.log('correct -> end game -> you win');

      // update game state with win message
      stateMsg('Game over winner! 🥳');

      endGame();

      // change guess number to winner colors
      guesses.lastElementChild.classList.add('winner');

      // reveal frames and guesses that winner did not see
      // if this is last guess theres no remainder
      if (guess < totalGuesses) {
        // build up remainder guess number html
        let remainder = ``;

        // calculate number of remaining frames to reveal
        for (let start = guess + 1; start <= totalGuesses; start++) {
          remainder += `<span>${start}</span>`;
        }

        // add remainder
        guesses.insertAdjacentHTML('beforeend', remainder);
      }

      // add correct guess to log
      logGuess('✔️', selection);
    } else if (guess === totalGuesses) {
      // console.log('incorrect -> end game -> you lose');

      // add incorrect guess to log
      logGuess('❌', selection);

      // update game state with lose message
      stateMsg('Game over loser 😢');

      endGame();
    } else {
      // incorrect

      // add incorrect guess to log
      logGuess('❌', selection);

      // increment guess
      guess++;

      // increment frame
      showFrame(guess);

      // increment guess UI
      addGuess();

      // update game state message
      stateMsg();
    }
  }
};

/*********************************************************
event listeners
*********************************************************/

// attach conditional listener to results list
resultsList.addEventListener('click', selectResult);

// show frame that is tied to guess number
guesses.addEventListener('click', toggleFrames);

// change the fuse pattern
search.addEventListener('input', fuseSearch);

/*********************************************************
start code execution
*********************************************************/

// show current frame
showFrame(guess);

// show game state message
stateMsg();
