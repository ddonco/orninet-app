import React from "react";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import { getYoloStatus } from "../utils/api.js";

export default class VideoStream extends React.Component {
  state = {
    imagePath: "/api/video_feed",
    yoloStatus: "active",
  };

  componentDidMount() {
    try {
      getYoloStatus().then((data) => {
        this.setState({
          yoloStatus: data.status,
        });
      });
    } catch (error) {
      this.setState({
        error: error,
      });
    }
  }

  componentWillUnmount() {
    this.setState({
      imagePath: "",
    });
  }

  render() {
    const { imagePath, yoloStatus } = this.state;

    return (
      <Container className="text-center">
        <h3>Live Feed</h3>
        {yoloStatus === "inactive" ? (
          <Image src={imagePath} fluid />
        ) : (
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <Alert variant="secondary">Camera in use by Yolo Object Detection service.</Alert>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}
