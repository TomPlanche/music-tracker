/**
 * @file src/assets/lastFM_handler.js
 * @description LastFM API handler. It uses the .env file to get the API key from the 'REACT_APP_LAST_FM_API_KEY' variable.
 * @author Tom Planche
 */



// IMPORTS ===================================================================================================  IMPORTS
// process
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES
const LAST_FM_API_KEY = import.meta.env.VITE_LAST_FM_API_KEY;

export const baseURL = "http://ws.audioscrobbler.com/2.0/";
// export const endURL = `&api_key=${LAST_FM_API_KEY}&format=json`;
export const endURL = `&api_key=${LAST_FM_API_KEY}&format=json`;
// END VARIABLES ======================================================================================= END VARIABLES

/**
 * @class LastFMHandler
 * @description This class is used to handle the LastFM API.
 * @constructor
 */
class LastFM_handler {
  // Static
  static instance = null;

  /**
   * @function getInstance
   * @description This function returns the instance of the LastFMHandler class,
   * this allows the singleton pattern.
   *
   * @param {string} username The username of the user.
   *
   * @returns {LastFMHandler} The instance of the LastFMHandler class.
   */
  static getInstance = (username = null) => {
    if (!this.instance) {
      this.instance = new LastFM_handler(username);
    }
    return this.instance;
  }

  // Constructor
  /**
   * @constructor
   * @description This is the constructor of the LastFMHandler class.
   * @param username {string} The username of the user.
   */
  constructor(username = null) {
    this.username = username || null;
  }

  // Methods
  /**
   * @function setUsername
   * @description This function sets the username of the LastFMHandler instance.
   * @param username {string} The username to set.
   */
  setUsername = (username) => {
    this.username = username;
  }
	
  /**
   * @function getUserInfo
   * @description This function gets the user info from the LastFM API.
   * @param user {string} The username to get the info from.
   * @returns {Promise<string>} The user info.
   */
  getUserData = (user = null) => {

    if (user) {
      this.setUsername(user);
    }

    if (!this.username) {
      throw new Error("No username provided");
    }

    const url = `${baseURL}?method=user.getinfo&user=${this.username}${endURL}`;

    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            reject(new Error(data.message));
          } else {
            resolve({
              album_count: data.user.album_count,
              artist_count: data.user.artist_count,
              image: data.user.image[2]["#text"],
              name: data.user.name,
              playcount: data.user.playcount,
              // Registered since (unix timestamp) converted to a date
              registered: new Date(data.user.registered['#text'] * 1000),
              url: data.user.url,
            });
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * @function getUserImage
   * @param user {string | null} The username to get the image from.
   * @returns {Promise<string | Error>} The user image.
   */
  getUserImage = (user = null) => {
    if (user) {
      this.setUsername(user);
    }

    if (!this.username) {
      throw new Error("No username provided");
    }

    const url = `${baseURL}?method=user.getinfo&user=${this.username}${endURL}`;

    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            reject(new Error(data.message));
          } else {
            resolve(data.user.image[2]["#text"]);
          }
        })
        .catch(error => {
          reject(error);

          // If error is net::ERR_INTERNET_DISCONNECTED
          if (error === "net::ERR_INTERNET_DISCONNECTED") {

          }
        });
    });
  }

  // Methods
  /**
   * @function getTopArtists
   * @description This function gets the top artists from the LastFM API for the user.
   * @param user {string} The username to get the top artists from.
   * @returns {Promise<string|Error>}
   */
  getTopArtists = (user = null) => {
    if (user) {
      this.setUsername(user);
    }

    const url = `${baseURL}?method=user.gettopartists&user=${this.username}${endURL}`;

    // Return a promise
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            reject(new Error(data.message));
          } else {
            resolve(data.topartists.artist);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * @function getYearlyScrobbles
   * @description This function gets the yearly top artists from the LastFM API for the user.
   * Description for the 'year' parameter:
   * Beginning timestamp of a range - only display scrobbles after this time, in UNIX timestamp format (integer number of seconds since 00:00:00, January 1st 1970 UTC). This must be in the UTC time zone.
   * @param user {string | null} The username to get the yearly top artists from.
   * @param year {number | null} The year to get the yearly top artists from, in UNIX timestamp format.
   * @param limit {number | null} The limit of the amount of artists to get (max 200).
   * @param page {number | null} The page to get the artists from.
   * @param extended {boolean | null} Whether or not to get extended info.
   * @param getInfo {boolean | null} Whether or not to get the info of all the scrobbles.
   *
   * @returns {Promise<string|Error>} The yearly top artists.
   */
  getYearlyScrobbles = async (
    user = null,
    year = new Date().getFullYear(),
    limit = 200,
    page = 1,
    extended = true,
    getInfo = false
  ) => {
    if (user) {
      this.setUsername(user);
    }

    // The limit can't be higher than 200 or lower than 1
    const limitValue = Math.min(Math.max(limit, 1), 200);

    // Convert the year to a unix timestamp
    const from = new Date(year, 0, 1).getTime() / 1000;
    const to = new Date(year + 1, 0, 1).getTime() / 1000;

    const url = `${baseURL}?method=user.getrecenttracks&user=${this.username}&from=${from}&to=${to}&limit=${limitValue}&page=${page}&extended=${extended ? 1 : 0}${endURL}`;

    // Return a promise
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            reject(new Error(data.message));
          } else {
            if (getInfo) {
              resolve(data.recenttracks['@attr']);
            } else {
              resolve(data.recenttracks.track);
            }
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * @function isCurrentlyPlaying
   * @description This function checks if the user is currently playing a song.
   *
   * @param user {string} The username to check.
   * @returns {Promise<string|Error>} The currently playing song.
   */
  isCurrentlyPlaying = (user = null) => {
    if (user) {
      this.setUsername(user);
    }

    const url = `${baseURL}?method=user.getrecenttracks&user=${this.username}${endURL}`;

    // Return a promise
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            reject(new Error(data.message));
          } else {
            if (data.recenttracks.track[0]['@attr']) {
              resolve(data.recenttracks.track[0]);
            } else {
              reject(new Error("No song currently playing"));
            }
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default LastFM_handler;

/**
 * End of file src/assets/lastFM_handler.js
 */
