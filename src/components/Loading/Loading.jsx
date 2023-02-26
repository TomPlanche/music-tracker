/**
 * @file src/components/Loading/Loading.jsx
 * @description Loading component.
 * @author Tom Planche
 */

// IMPORTS ===================================================================================================  IMPORTS
import {useContext, useEffect, useLayoutEffect, useRef, useState} from "react";

import {
  gsap,
} from "gsap";

import SplitText from "gsap/SplitText";

import {
  StepContext
} from "../../App.jsx";

import AudioScrobbler from "/src/assets/audio-scrobbler-logo.png";
import ViteLogo from "/src/assets/vite.svg";
import ReactLogo from "/src/assets/react.svg";
// END IMPORTS ==========================================================================================   END IMPORTS

// VARIABLES ================================================================================================ VARIABLES
import styles from "./Loading.module.scss";
// END VARIABLES ======================================================================================= END VARIABLES

gsap.registerPlugin(SplitText);

// COMPONENENT  ============================================================================================= COMPONENT
/**
 * Loading component
 * @return {JSX.Element}
 * @constructor
 **/
const Loading = () => {
  // State
  const [isLoaded, setIsLoaded] = useState(false);

  // Refs
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const imagesRef = useRef([])

  // Context
  const {step, onDataRecievedFromChild} = useContext(StepContext);

  // Use effect
  useEffect(() => {
    // For each image in imagesRef, find the largest width
    const maxWidth = Math.max(...imagesRef.current.map((image) => image.clientWidth));

    // Set the width of the other images to the largest width
    imagesRef.current.forEach((image) => {
      image.style.width = maxWidth + "px";
    });
  }, [])

  // Layout effect
  useLayoutEffect(() => {
    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power4.out",
      },
      onComplete: () => {
        onDataRecievedFromChild({
          step: step + 1,
        });
        setIsLoaded(true);
      }
    });

    const splitText = new SplitText(titleRef.current, {
      type: "words",
    });

    tl
      .to(imagesRef.current, {
        opacity: 0,
        duration: 0,
        y: 20,
      })
      .fromTo(splitText.words, {
        y: 20,
        opacity: 0,
      }, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
      }).to(imagesRef.current, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        y: 0,
      })
      .to(containerRef.current, {
        opacity: 0,
        scale: 0,
        duration: 0.5,
        delay: 1
      })
  }, [])

  // Render
  return (
    !isLoaded &&
      <div
        className={styles.loading}
        ref={containerRef}
      >

        <h1
          className={styles.loading__title}
          ref={titleRef}
        >
          Made using
        </h1>

        <div className={styles.loading__logos}>
          <a
            href="https://vitejs.dev/"
            ref={el => imagesRef.current.push(el)}
          >
            <img
              alt="vite"
              src={ViteLogo}
              title={"Made using vite..."}
            />
            Vite
          </a>

          <a
            href="https://reactjs.org/"
            ref={el => imagesRef.current.push(el)}
          >
            <img
              alt="react"
              src={ReactLogo}
              title={"Made using react..."}
            />
            React
          </a>

          <a
            href="https://www.last.fm/"
            ref={el => imagesRef.current.push(el)}
          >
            <img
              alt="audio scrobbler"
              src={AudioScrobbler}
              title={"Made using audio scrobbler..."}
            />
            LastFM
            AudioScrobbler
          </a>
        </div>

      </div>
  )
}
// END COMPONENT =======================================================================================  END COMPONENT

export default Loading;

/**
 * End of file src/components/Loading/Loading.jsx
 */
