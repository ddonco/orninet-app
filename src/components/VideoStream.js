import React from "react";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { Fragment } from "react";

import { getYoloStatus, closeVideoStream } from "../utils/api.js";

export default class VideoStream extends React.Component {
  state = {
    imagePath: "/api/video_feed",
    yoloStatus: "active",
    showVideo: false
  };

  handleCloseVideoStream = () => {
    closeVideoStream().then((data) => {});
    this.setState({
      showVideo: false
    });
  };

  handleOpenVideoStream() {
    this.setState({
      showVideo: true
    });
  }

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
    const { imagePath, yoloStatus, showVideo } = this.state;

    return (
      <Container fluid className="text-center">
        <h3 className="mb-5">Live Feed</h3>
        {yoloStatus === "inactive" ? (
          <Fragment>
            {showVideo ? (
              <Fragment>
                <Row>
                  <Col>
                  <Image className="mb-3" src={imagePath} fluid />
                  </Col>
                </Row>
                <Row>
                  <Col>
                  <Button
                    variant="outline-dark"
                    onClick={() => this.handleCloseVideoStream()}
                  >
                    Close Stream
                  </Button>
                  </Col>
                </Row>
              </Fragment>
            ) : (
              <Row>
                <Col>
                <Button
                  variant="info"
                  onClick={() => this.handleOpenVideoStream()}
                >
                  Open Stream
                </Button>
                </Col>
              </Row>
            )}
          </Fragment>
        ) : (
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <Alert variant="secondary">
                Camera in use by Yolo Object Detection service.
              </Alert>
            </Col>
          </Row>
        )}
      </Container>
    );
  }
}
