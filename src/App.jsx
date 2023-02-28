/**
 * @file Main component for the application.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import {createContext, useEffect, useState} from "react";

import LoadingData from "./components/LoadingData/LoadingData.jsx";
import Loading from "./components/Loading/Loading.jsx";
import UsernameForm from "./components/UsernameForm/UsernameForm.jsx";

import styles from './App.module.scss'

import LastFM_handler from "/src/assets/LastFM_handler.js";
import FileTreatmentTest from "./components/FileTreatmentTest/FileTreatmentTest.jsx";
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES
export const LastFM_HandlerInstance = LastFM_handler.getInstance();

export const StepContext = createContext(null);

const API_TESTS = false;
// END VARIABLES =======================================================================================  END VARIABLES

// COMPONENT ================================================================================================ COMPONENT
function App() {
  // States
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState(null);
  const [userData, setUserData] = useState(null);

  // Use effect
  /**
   * This effect is called when the username is set.
   * It calls the LastFM_HandlerInstance to get the user's data.
   * It then sets the user's data in the state.
   */
  useEffect(() => {
    if (username) {
      LastFM_HandlerInstance.getUserData(username).then((data) => {
        console.log(`Data recieved from LastFM_HandlerInstance: ${data}`);
        setUserData(data);
      });
    }
  }, [username]);

  // Functions
  /**
   * Function called when data is recieved from a child component.
   * @param data {Object} Data recieved from the child component.
   */
  const onDataRecievedFromChild = (data) => {
    for (let key in data) {
      switch (key) {
        case 'step':
          setStep(data[key]);
          break;
        case 'username':
          setUsername(data[key]);
          break;
      }
    }
  }

  // Render
  return (
    <div className={styles.App}>
      {
        API_TESTS ?
          <LoadingData/>
          // <FileTreatmentTest />
          :
          <StepContext.Provider value={{step, onDataRecievedFromChild}}>
            <div className={styles.App}>
              {step === 0 && <Loading/>}
              {step === 1 && <UsernameForm />}
              {step === 2 && <LoadingData username={username} />}
            </div>
          </StepContext.Provider>
      }

    </div>
  );
}
// END COMPONENT ======================================================================================== END COMPONENT

export default App

/**
 * End of file App.jsx
 */
