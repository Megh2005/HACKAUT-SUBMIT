import React, { useEffect, useRef } from "react";

const TranslateComponent = () => {
  const googleTranslateRef = useRef(null);

  useEffect(() => {
    let intervalid;

    const checkGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        clearInterval(intervalid);
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            layout:
              window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          googleTranslateRef.current
        );
      }
    };

    intervalid = setInterval(checkGoogleTranslate, 100);
    return () => clearInterval(intervalid); // Clean up the interval
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "5px 10px", // Reduce padding to make the box smaller
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        height: "40px", // Set a smaller height
        marginBottom: "10px",
      }}
    >
      <label
        style={{
          marginRight: "8px", // Slightly smaller margin
          fontSize: "12px", // Smaller font size
          color: "#333",
          fontWeight: 500,
        }}
      >
        Translate:
      </label>
      <div
        id="google_translate_element"
        style={{ display: "inline-block" }}
        ref={googleTranslateRef}
      ></div>
    </div>
  );
};

export default TranslateComponent;
