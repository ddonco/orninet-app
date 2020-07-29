import React from "react";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import { getYolov3Status } from "../utils/api.js";

export default class VideoStream extends React.Component {
  state = {
    imagePath: "/api/video_feed",
    yolov3Status: "active",
  };

  componentDidMount() {
    try {
      getYolov3Status().then((data) => {
        this.setState({
          yolov3Status: data.status,
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
    const { imagePath, yolov3Status } = this.state;

    return (
      <Container className="text-center">
        <h3>Live Feed</h3>
        {yolov3Status === "inactive" ? (
          <Image src={imagePath} fluid />
        ) : (
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <Alert variant="secondary">Camera in use by YoloV3 service.</Alert>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}
