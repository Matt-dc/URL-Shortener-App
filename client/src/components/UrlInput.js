import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Spinner from "./Spinner";

export default function ShortenerInput(props) {
  const changeHandler = e => {
    props.handleChange(e);
  };

  const spinner = <Spinner className="spinner" size="2x" spinning="spinning" />;

  return (
    <InputGroup size="lg" className="mb-3">
      <FormControl
        style={{ color: props.shortened ? "#5f82d1" : "" }}
        onChange={changeHandler}
        value={props.URL}
        placeholder="Paste in your link"
      />

      <InputGroup.Append>
        {props.shortened ? (
          <CopyToClipboard
            text={props.URL}
            onCopy={() => props.setCopiedTrue("main")}
          >
            <Button variant={props.copied === "main" ? "success" : "primary"}>
              {props.copied === "main" ? "Copied" : "Copy"}
            </Button>
          </CopyToClipboard>
        ) : (
          <Button
            className="shorten-btn-style"
            disabled={props.disabled}
            onClick={props.handleShorten}
          >
            {props.loading ? spinner : "Shorten"}
          </Button>
        )}
      </InputGroup.Append>
    </InputGroup>
  );
}
