import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getYoloStatus,
  startYoloStatus,
  stopYoloStatus,
} from "../utils/api.js";

const activeStyle = {
  color: "#11bf40",
};

const inactiveStyle = {
  color: "#bf1111",
};

export default class SystemControl extends React.Component {
  state = {
    yoloStatus: "inactive",
    showModal: false,
    error: null,
  };

  handleModelClose = () => {
    this.setState({
      showModal: false,
    });
  };

  handleModelShow = () => {
    this.setState({
      showModal: true,
    });
  };

  handleServiceControl = () => {
    if (this.state.yoloStatus === "inactive") {
      startYoloStatus().then((data) => {
        this.setState({
          yoloStatus: data.status,
        });
      });
    } else {
      stopYoloStatus().then((data) => {
        this.setState({
          yoloStatus: data.status,
        });
      });
    }
    this.setState({
      showModal: false,
    })
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

  render() {
    console.log(this.state.yoloStatus);

    return (
      <Container className="text-center">
        <h3>
          OrniNet Status:
          <span
            style={
              this.state.yoloStatus === "inactive"
                ? inactiveStyle
                : activeStyle
            }
          >
            {` ${this.state.yoloStatus}`}
          </span>
        </h3>
        <Button
          className="mt-3"
          variant="primary"
          onClick={this.handleModelShow}
        >
          {this.state.yoloStatus === "inactive"
            ? "Start Service"
            : "Stop Service"}
        </Button>
        <Modal
          show={this.state.showModal}
          onHide={this.handleModelClose}
          backdrop="static"
          keyboard={false}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Yolo Object Detection Service</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.yoloStatus === "inactive"
              ? "Start Yolo Object Detection Service?"
              : "Stop Yolo Object Detection Service?"}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModelClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => this.handleServiceControl()}
            >
              {this.state.yoloStatus === "inactive" ? "Start" : "Stop"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}
