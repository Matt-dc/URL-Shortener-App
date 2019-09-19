import React from "react";

const WarningMessage = props => (
  <span style={{ color: "red", fontSize: "0.8em" }}>{props.error}</span>
);

export default WarningMessage;
