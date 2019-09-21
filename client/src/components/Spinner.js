import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function Spinner(props) {
  return (
    <Container>
      <Row className="spinner">
        <Col>
          <div className={` ${props.spinning}`}>
            <i className={`fa fa-spinner fa-spin fa-${props.size}x`}></i>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
