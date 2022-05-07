// JSON fetch utility
const fetchJSON = async url => {
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json;
  } catch (error) {
    console.error(error);
    return false;
  }
};

try {
  // test Fuse library
  if (!Fuse) {
    throw new Error('unable to load Fuse.js');
  }

  // load data
  const data = await fetchJSON('../data/data.json');

  // test data
  if (!data) {
    throw new Error('unable to load data.json');
  }

  // configure fuse search options
  const options = {
    // isCaseSensitive: false,
    // includeScore: false,
    // shouldSort: true,
    // includeMatches: false,
    // findAllMatches: false,
    // minMatchCharLength: 1,
    // location: 0,
    // threshold: 0.6,
    // distance: 100,
    // useExtendedSearch: false,
    // ignoreLocation: false,
    // ignoreFieldNorm: false,
    // fieldNormWeight: 1,
    keys: ['title', 'season', 'episode']
  };

  // create fuse instance
  window.fuse = new Fuse(data, options);

  // dynamic import game logic if data and library load correctly
  const main = await import('./main.js');

  // test game logic module
  if (!main) {
    throw new Error('unable to load main.js');
  }

  console.log('all game dependencies loaded');
} catch (e) {
  // log error for tracing
  // console.error('Error: unable to load all game dependencies');
  console.error(e);

  // wipe game html and display error message to user
  document.body.textContent = 'Error: unable to load all game dependencies';
}
