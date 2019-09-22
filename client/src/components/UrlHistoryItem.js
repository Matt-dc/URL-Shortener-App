import React from "react";
import { Col, Row, Button, InputGroup, FormControl } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function InputForm(props) {
  const handleChange = e => {
    props.urlUpdateHandler(e);
  };

  return (
    <>
      <Row className="input-url">
        {props.isBeingEdited === props.url.longUrl ? (
          <Col md={5}>
            <InputGroup className="mb-3">
              <FormControl onChange={handleChange} value={props.urlUpdater} />
            </InputGroup>
          </Col>
        ) : (
          <Col md={5}>
            <Row>
              <Col style={{ textAlign: "left" }}>{props.url.longUrl}</Col>
            </Row>
            <Row style={{ marginTop: "1em", fontSize: "0.8em" }}>
              <Col style={{ textAlign: "left" }}>
                <p>Link deletes in : {props.timeRemaining} </p>
              </Col>
            </Row>
          </Col>
        )}

        <Col md={3}>
          <a href={props.url.longUrl}>{props.url.shortUrl}</a>
        </Col>
        <Col md={1} style={{ marginRight: "0.5em" }}>
          <CopyToClipboard
            text={props.url.shortUrl}
            onCopy={() => props.setCopiedTrue(props.url.shortUrl)}
          >
            <Button
              md={1}
              variant={
                props.copied === props.url.shortUrl ? "success" : "secondary"
              }
            >
              {props.copied === props.url.shortUrl ? "Copied" : "Copy"}
            </Button>
          </CopyToClipboard>
        </Col>
        <Col md={2}>
          {props.isBeingEdited === props.url.longUrl ? (
            <Button
              size="sm"
              onClick={() => props.saveUrl(props.url)}
              style={{ marginRight: "1em" }}
              variant="warning"
            >
              Save
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => props.updateUrl(props.url.longUrl)}
              style={{ marginRight: "1em" }}
              variant="info"
            >
              Update
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => props.displayDeleteModal(props.url)}
            variant="danger"
          >
            Delete
          </Button>
        </Col>
      </Row>
    </>
  );
}
