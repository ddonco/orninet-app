import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import Alert from "react-bootstrap/Alert";
import CardColumns from "react-bootstrap/CardColumns";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { getArchiveData } from "../utils/api";
import ImageCard from "./ImageCard";

export default class ArchivePage extends React.Component {
  state = {
    page: 1,
    images: [],
    imagePath: "",
    hasNextPage: false,
    hasPrevPage: false,
    error: null,
  };

  componentDidMount() {
    const { page } = queryString.parse(this.props.location.search);

    getArchiveData(page).then((data) => {
      this.setState({
        page: page,
        images: data.payload.images,
        imagePath: data.payload.image_path,
        hasNextPage: data.payload.has_next_page,
        hasPrevPage: data.payload.has_prev_page,
      });
    });
  }

  componentDidUpdate() {
    const { page } = queryString.parse(this.props.location.search);

    if (page != this.state.page) {
      getArchiveData(page).then((data) => {
        this.setState({
          page: page,
          images: data.payload.images,
          imagePath: data.payload.image_path,
          hasNextPage: data.payload.has_next_page,
          hasPrevPage: data.payload.has_prev_page,
        });
      });
    }
  }

  pageClick = (direction) => {
    var { page } = queryString.parse(this.props.location.search);

    if (direction === "next") {
      page++;
    } else if (direction === "prev") {
      page--;
    }

    getArchiveData(page).then((data) => {
      this.setState({
        images: data.payload.images,
        imagePath: data.payload.image_path,
        hasNextPage: data.payload.has_next_page,
        hasPrevPage: data.payload.has_prev_page,
      });
    });
  };

  render() {
    const { images, imagePath, hasNextPage, hasPrevPage, error } = this.state;
    const { page } = queryString.parse(this.props.location.search);
    const currentPage = parseInt(page, 10);

    return (
      <React.Fragment>
        <Container>
          {error && (
            <Alert variant="danger">Error retrieving data: {error}</Alert>
          )}
          <Row className="mt-2">
            <CardColumns>
              {images.length > 0 &&
                error == null &&
                images.map((image) => (
                  <ImageCard key={image.id} value={image} />
                ))}
            </CardColumns>
          </Row>
          <Row className="justify-content-md-center my-3">
            {hasPrevPage && (
              <Button
                variant="outline-primary"
                onClick={() => this.pageClick("prev")}
              >
                <Link
                  to={{
                    pathname: "/archive",
                    search: `?page=${currentPage - 1}`,
                  }}
                >
                  Prev
                </Link>
              </Button>
            )}
            {hasNextPage && (
              <Button
                variant="outline-primary"
                onClick={() => this.pageClick("next")}
              >
                <Link
                  to={{
                    pathname: "/archive",
                    search: `?page=${currentPage + 1}`,
                  }}
                >
                  Next
                </Link>
              </Button>
            )}
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
