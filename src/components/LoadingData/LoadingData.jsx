/**
 * @file src/components/LoadingData/LoadingData.jsx
 * @description LoadingData component.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import {useEffect, useRef, useState} from "react";

import styles from "./LoadingData.module.scss";

import {LastFM_HandlerInstance} from "../../App.jsx";

import store from "store2";
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES

// END VARIABLES ======================================================================================= END VARIABLES

// COMPONENENT  ============================================================================================= COMPONENT
/**
 * LoadingData component
 * @return {JSX.Element}
 * @constructor
 **/
const LoadingData = (props) => {
  // State
  const [userData, setUserData] = useState(null);
  const [finalData, setFinalData] = useState(null);
  const [yearlyScrobblesInfo, setYearlyScrobblesInfo] = useState(null);
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const [step, setStep] = useState(0);

  // Refs
  const pagesFetchedRef = useRef(0);
  const loadingPercentageRef = useRef(0);
  const loadingRef = useRef(null);

  // Functions
  /**
   * Update the loading percentage.
   * @return {void}
   */
  const updateLoadingPercentage = () => {
    pagesFetchedRef.current += 1;

    loadingPercentageRef.current = Math.min(Math.round((pagesFetchedRef.current / yearlyScrobblesInfo.totalPages) * 100), 100);
    loadingRef.current.style.width = loadingPercentageRef.current + "%";
  }

  /**
   * Get all the scrobbles from the user
   * @return {Promise<void>} A promise that resolves when all the scrobbles are fetched.
   */
  const getAllScrobbles = () => {
    if (dataIsLoaded || step !== 0) return;

    for (let i = yearlyScrobblesInfo.totalPages; i > 1; i--) {
      // Get the scrobbles from the page
      LastFM_HandlerInstance.getYearlyScrobbles(
        props.username ?? "tom_planche", // the username
        2022, // the year
        200, // the limit of scrobbles to get
        i, // the page of scrobbles to get
        true, // whether to have extended info or not
        false // whether to have the scrobbles infos or not
      )
        .then((data) => {
          // Update the loading percentage
          setUserData((prev) => {
            return {
              ...prev,
              tracks: [
                ...prev.tracks,
                ...data
              ]
            }
          })
        })
        .finally(() => {
          updateLoadingPercentage();
        });
    }

    // Get the scrobbles from the first page
    LastFM_HandlerInstance.getYearlyScrobbles(
      props.username ?? "tom_planche", // the username
      2022, // the year
      200, // the limit of scrobbles to get
      1, // the page of scrobbles to get
      true, // whether to have extended info or not
      false // whether to have the scrobbles infos or not
    )
    .then((data) => {
      // Update the loading percentage
      setUserData((prev) => {
        return {
          ...prev,
          tracks: [
            ...prev.tracks,
            ...data
          ]
        }
      })
    })
    .finally(() => {
      if (!dataIsLoaded) {
        updateLoadingPercentage();
      }
      setDataIsLoaded(true);
    });
  }


  const treatData = () => {
    // Create a new array with the tracks
    let tracks = JSON.parse(JSON.stringify(userData.tracks));

    // Add a count variable to each track
    tracks.forEach((track, _) => {
      track.count = 1;
    });

    // Remove duplicates
    tracks = tracks.filter((track, index, self) => {
      return index === self.findIndex((t) => {
        // Update the count variable
        if (t.name === track.name && t.artist.name === track.artist.name) {
          t.count += 1;
        }
        return t.name === track.name && t.artist.name === track.artist.name;
      });
    });

    // Sort the tracks by artist name
    tracks.sort((a, b) => {
      if (a.artist.name < b.artist.name) {
        return -1;
      }
      if (a.artist.name > b.artist.name) {
        return 1;
      }
      return 0;
    });
    // Sort the tracks by track name
    tracks.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    setFinalData({
      totalScrobbles: userData.totalScrobbles,
      tracks: tracks
    });

    store.set();
  }


  // Use effect
  // When the component is mounted, if the yearlyScrobblesInfo is not set, get the data from LastFM_HandlerInstance
  useEffect(() => {
    console.log(`[Apitests.jsx] yearlyScrobblesInfo: ${yearlyScrobblesInfo}`);
    if (!yearlyScrobblesInfo && !dataIsLoaded && step === 0) {
      LastFM_HandlerInstance.getYearlyScrobbles(
        props.username ?? "tom_planche", // the username
        2022, // the year
        200, // the limit of scrobbles to get
        1, // the page of scrobbles to get
        false, // whether to have extended info or not
        true // whether to have the scrobbles infos or not
      )
      .then((data) => {
        setYearlyScrobblesInfo(data);
      });
    }
  }, []);


  useEffect(() => {

    if (yearlyScrobblesInfo && !dataIsLoaded && step === 0) {
      setUserData({
        totalScrobbles: yearlyScrobblesInfo.total,
        tracks: []
      })

      // For each page from totalPages to 1
      getAllScrobbles();
    }
  }, [yearlyScrobblesInfo]);


  useEffect(() => {
    if (userData) {
      console.log(`[Apitests.jsx] userData recieved:`);
    }
  }, [userData]);


  useEffect(() => {
    if (dataIsLoaded && step === 0) {
      treatData();

      setTimeout(() => {
        setStep(1);
      }, 2000);
    }
  }, [dataIsLoaded]);


  // Render
  return (
    <div>
      <h1>Apitests</h1>

      {
        step === 0 &&
        <div className={styles.loadingContainer}>
          <div
            className={styles.loadingContainer__inner}
            ref={loadingRef}
          >
            <p>{loadingPercentageRef.current}%</p>
          </div>
        </div>
      }

      {
        step === 1 &&
        <>
          <p>totalScrobbles: {finalData.totalScrobbles}</p>
          <p>tracks number: {finalData.tracks.length}</p>
        </>
      }

    </div>
  )
}
// END COMPONENT =======================================================================================  END COMPONENT

export default LoadingData;

/**
 * End of file src/components/LoadingData/LoadingData.jsx
 */
