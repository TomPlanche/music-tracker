/**
 * @file src/components/Apitests/Apitests.jsx
 * @description Apitests component.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import {useEffect, useRef, useState} from "react";

import {LastFM_HandlerInstance} from "../../App.jsx";
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES

// END VARIABLES ======================================================================================= END VARIABLES

// COMPONENENT  ============================================================================================= COMPONENT
/**
 * Apitests component
 * @return {JSX.Element}
 * @constructor
 **/
const Apitests = () => {
  // State
  const [userData, setUserData] = useState(null);
  const [yearlyScrobblesInfo, setYearlyScrobblesInfo] = useState(null);

  // Refs
  const pagesFetchedRef = useRef(0);
  const loadingPercentageRef = useRef(0);

  // Functions
  const updateLoadingPercentage = () => {
    pagesFetchedRef.current += 1;

    loadingPercentageRef.current = Math.round((pagesFetchedRef.current / yearlyScrobblesInfo.totalPages) * 100);

  }


  const getAllScrobbles = () => {
    for (let i = yearlyScrobblesInfo.totalPages; i > 1; i--) {
      // Get the scrobbles from the page
      LastFM_HandlerInstance.getYearlyScrobbles(
        "tom_planche", // the username
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
      "tom_planche", // the username
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

      console.log("zegzerg");
    })
    .finally(() => {
      updateLoadingPercentage();
    });
  }

  // Use effect
  // When the component is mounted, if the yearlyScrobblesInfo is not set, get the data from LastFM_HandlerInstance
  useEffect(() => {
    console.log(`[Apitests.jsx] yearlyScrobblesInfo: ${yearlyScrobblesInfo}`);
    if (!yearlyScrobblesInfo) {
      LastFM_HandlerInstance.getYearlyScrobbles(
        "tom_planche", // the username
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

    if (yearlyScrobblesInfo) {
      setUserData({
        totalScrobbles: yearlyScrobblesInfo.total,
        tracks: []
      })

      // For each page from totalPages to 1
      console.log(`[Apitests.jsx] yearlyScrobblesInfo: ${yearlyScrobblesInfo.totalPages}`);
      getAllScrobbles();
    }
  }, [yearlyScrobblesInfo]);


  useEffect(() => {
    if (userData) {
      console.log(`[Apitests.jsx] userData recieved:`);
    }
  }, [userData]);

  // Render
  return (
    <div>
      <h1>Apitests</h1>
      <p>loadingPercentage: {loadingPercentageRef.current}</p>
    </div>
  )
}
// END COMPONENT =======================================================================================  END COMPONENT

export default Apitests;

/**
 * End of file src/components/Apitests/Apitests.jsx
 */
