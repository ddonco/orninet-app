import React from "react";
import Alert from "react-bootstrap/Alert";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import CardColumns from "react-bootstrap/CardColumns";

import { getHomeData } from "../utils/api";
import ImageCard from "./ImageCard";

export default class HomeCards extends React.Component {
  state = {
    images: [],
    imagePath: "",
    error: null,
  };

  componentDidMount() {
    try {
      getHomeData().then((data) => {
        this.setState({
          images: data.payload.images,
          imagePath: data.payload.image_path,
        });
      });
    } catch (error) {
      this.setState({
        error: error,
      });
    }
  }

  render() {
    const { images, imagePath, error } = this.state;

    return (
      <Container>
        {error && (
          <Alert variant="danger">Error retrieving data: {error}</Alert>
        )}
        <Row className="mt-2">
          <CardColumns>
            {images.length > 0 &&
              error == null &&
              images.map((image) => <ImageCard key={image.id} value={image} />)}
          </CardColumns>
        </Row>
      </Container>
    );
  }
}
