import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import {
  getYolov3Status,
  startYolov3Status,
  stopYolov3Status,
} from "../utils/api.js";

const activeStyle = {
  color: "#11bf40",
};

const inactiveStyle = {
  color: "#bf1111",
};

export default class SystemControl extends React.Component {
  state = {
    yolov3Status: "inactive",
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
    if (this.state.yolov3Status === "inactive") {
      startYolov3Status().then((data) => {
        this.setState({
          yolov3Status: data.status,
        });
      });
    } else {
      stopYolov3Status().then((data) => {
        this.setState({
          yolov3Status: data.status,
        });
      });
    }
    this.setState({
      showModal: false,
    })
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

  render() {
    console.log(this.state.yolov3Status);

    return (
      <Container className="text-center">
        <h3>
          OrniNet Status:
          <span
            style={
              this.state.yolov3Status === "inactive"
                ? inactiveStyle
                : activeStyle
            }
          >
            {` ${this.state.yolov3Status}`}
          </span>
        </h3>
        <Button
          className="mt-3"
          variant="primary"
          onClick={this.handleModelShow}
        >
          {this.state.yolov3Status === "inactive"
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
            <Modal.Title>YoloV3 Service</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.yolov3Status === "inactive"
              ? "Start YoloV3 Service?"
              : "Stop YoloV3 Service?"}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModelClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => this.handleServiceControl()}
            >
              {this.state.yolov3Status === "inactive" ? "Start" : "Stop"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}
