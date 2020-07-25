import React from "react";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

export default class VideoStream extends React.Component {
  state = {
    imagePath: "/api/video_feed",
  };

  componentWillUnmount() {
    this.setState({
      imagePath: ""
    })
  }

  render() {
    return (
      <Container className="text-center">
        <h3>Live Feed</h3>
        <Image src={this.state.imagePath} fluid />
      </Container>
    );
  }
}
