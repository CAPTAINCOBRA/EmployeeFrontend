import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

const Loader = () => {
  return (
    <Backdrop sx={{ zIndex: 5000 }} open={true} invisible={false}>
      <div className="ContentLoader">
        <CircularProgress sx={{ color: "#fff" }} />
      </div>
    </Backdrop>
  );
};

export default Loader;
