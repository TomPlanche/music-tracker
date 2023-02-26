/**
 * @file src/components/UsernameForm/UsernameForm.jsx
 * @description UsernameForm component.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import {useContext, useEffect, useRef, useState} from "react";

import {gsap} from "gsap";

import styles from './UsernameForm.module.scss'

import {LastFM_HandlerInstance, StepContext} from "../../App.jsx";
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES
// END VARIABLES ======================================================================================= END VARIABLES

// COMPONENENT  ============================================================================================= COMPONENT
/**
 * UsernameForm component
 * @return {JSX.Element}
 * @constructor
 **/
const UsernameForm = () => {
  // State
  const [username, setUsername] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  // Refs
  const inputRef = useRef(null);
  const imageRef = useRef(null);

  // Context
  const {step, onDataRecievedFromChild} = useContext(StepContext);

  // Functions
  /**
   * Function called when the user types in the input.
   * @param event {Event} Event object.
   * @return {void}
   */
  const handleInputChange = (event) => {
    // Use regex
    // Votre nom d'utilisateur doit comporter entre 2 et 15 caractères, commencer par une lettre et ne contenir que des lettres, nombres, '_' ou
    const regex = /^[a-zA-Z][a-zA-Z0-9_]{1,14}$/;
    const value = event.target.value;

    if (regex.test(value)) {
      setUsername(value);

      // unset the element's style
      inputRef.current.style = '';

      // enable the button
      setButtonDisabled(false)
    } else {
      setUsername('');

      inputRef.current.style.outlineColor = 'red';

      // disable the button
      setButtonDisabled(true)
    }
  }

  /**
   * Function called when the user presses a key.
   * I'm looking for the Enter key.
   * @param event {Event} Event object.
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmitButtonClick();
    }
  }

  /**
   * Function called when the user clicks on the submit button.
   * @return {void}
   */
  const handleSubmitButtonClick = () => {
    // Disable the input
    setInputDisabled(true);

    LastFM_HandlerInstance.setUsername(username);

    LastFM_HandlerInstance.getUserImage()
      .then((image) => {
        setImageSrc(image);
      })
      .catch((error) => {
        console.error(error);
        setImageSrc('')
      });
  }

  const handleChangeUsernameButtonClick = () => {
    setImageSrc('');
    setInputDisabled(false);
  }


  const handleContinueButtonClick = () => {
    onDataRecievedFromChild({
      step: step + 1,
      username: username,
    })
  }

  // Render
  return (
    <div
      className={styles.usernameForm}
    >
      <h1 className={styles.usernameForm__title}>
        Music Tracker
      </h1>

      <div className={styles.usernameForm__container}>
        <h2>
          Enter your username
        </h2>

        <input
          type="text"
          className={styles.usernameForm__input}
          ref={inputRef}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={inputDisabled}
        />

        {
          imageSrc !== '' &&
          <>
            <img
              ref={imageRef}
              src={imageSrc}
              alt="User image"
            />

            <div
              className={styles.usernameForm__buttonContainer}
            >
              <button
                className={styles.usernameForm__button}
                onClick={handleChangeUsernameButtonClick}
              >
                Back
              </button>

              <button
                className={styles.usernameForm__button}
                onClick={handleContinueButtonClick}
              >
                That's me!
              </button>

            </div>
          </>
        }

        {
          imageSrc === '' &&
          <button
            className={styles.usernameForm__button}
            onClick={handleSubmitButtonClick}
            disabled={buttonDisabled}
          >
            Submit
          </button>
        }
      </div>

    </div>
  )
}
// END COMPONENT =======================================================================================  END COMPONENT

export default UsernameForm;

/**
 * End of file src/components/UsernameForm/UsernameForm.jsx
 */
