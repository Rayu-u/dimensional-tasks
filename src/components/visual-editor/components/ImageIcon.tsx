import React from "react";

import "./buttonized.css";

// can also be a button, so it includes props for clicking and buttonstyles
const ImageIcon: React.FC<{
  color: string;
  img: string;
  width: string;
  buttonize?: boolean;
  onClick?: () => void;
}> = ({ color, img, width, buttonize, onClick }) => {
  return (
    <>
      <div
        className={buttonize ? "buttonized" : ""}
        style={{
          backgroundColor: color,
          width: width,
          height: width,
          borderRadius: "10px",
          margin: "2px",
          padding: "4px",
        }}
        onClick={onClick}
      >
        <img
          src={img}
          alt="add cube"
          style={
            {
              borderRadius: "5px",
              width: "100%",
              objectFit: "cover",
              margin: "0",
              UserDrag: "none",
              WebkitUserDrag: "none",
              UserSelect: "none",
              MozUserSelect: "none",
              WebkitUserSelect: "none",
              MsUserSelect: "none",
            } as React.CSSProperties
          }
        />
      </div>
    </>
  );
};

export default ImageIcon;
