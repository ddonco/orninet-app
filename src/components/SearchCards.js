import React from "react";
import { Link } from "react-router-dom";
import queryString from "query-string";
import Alert from "react-bootstrap/Alert";
import CardColumns from "react-bootstrap/CardColumns";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import { getSearchData } from "../utils/api";
import ImageCard from "./ImageCard";

export default class SearchPage extends React.Component {
  state = {
    query: "",
    images: [],
    imagePath: "",
    hasNextPage: false,
    hasPrevPage: false,
    error: null,
  };

  componentDidMount() {
    const { query, page } = queryString.parse(this.props.location.search);

    getSearchData(query, page).then((data) => {
      this.setState({
        query: query,
        images: data.payload.images,
        imagePath: data.payload.image_path,
        hasNextPage: data.payload.has_next_page,
        hasPrevPage: data.payload.has_prev_page,
      });
    });
  }

  componentDidUpdate() {
    const { query, page } = queryString.parse(this.props.location.search);

    if (query !== this.state.query) {
      getSearchData(query, page).then((data) => {
        this.setState({
          query: query,
          images: data.payload.images,
          imagePath: data.payload.image_path,
          hasNextPage: data.payload.has_next_page,
          hasPrevPage: data.payload.has_prev_page,
        });
      });
    }
  }

  pageClick = (direction) => {
    var { query, page } = queryString.parse(this.props.location.search);

    if (direction === "next") {
      page++;
    } else if (direction === "prev") {
      page--;
    }

    getSearchData(query, page).then((data) => {
      this.setState({
        query: query,
        images: data.payload.images,
        imagePath: data.payload.image_path,
        hasNextPage: data.payload.has_next_page,
        hasPrevPage: data.payload.has_prev_page,
      });
    });
  };

  render() {
    const { images, imagePath, hasNextPage, hasPrevPage, error } = this.state;
    const { query, page } = queryString.parse(this.props.location.search);
    const currentPage = parseInt(page, 10);

    return (
      <React.Fragment>
        <Container>
          <h2 className="text-center">Results for '{query}'</h2>
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
                    pathname: "/search",
                    search: `?query=${query}&page=${currentPage - 1}`,
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
                    pathname: "/search",
                    search: `?query=${query}&page=${currentPage + 1}`,
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
