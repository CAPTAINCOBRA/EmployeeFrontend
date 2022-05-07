import React, { Fragment } from "react";
import "./Toast.scss";

const Toast = (props) => {
  const { msg } = props;

  return (
    <>
      <div className="Text">{msg}</div>
    </>
  );
};

export default Toast;
