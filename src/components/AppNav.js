import React from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

const activeStyle = {
  color: "#17a2b8",
};

class AppNav extends React.Component {
  state = {
    searchQuery: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      searchQuery: event.target.value,
    });

    this.props.history.push(`/search?query=${this.state.searchQuery}&page=1`);
  };

  handleChange = (event) => {
    this.setState({
      searchQuery: event.target.value,
    });
  };

  render() {
    const { searchQuery } = this.state;

    return (
      <React.Fragment>
        <Navbar expand="sm" bg="dark" variant="dark">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavLink
                to="/"
                exact
                className="nav-link"
                activeStyle={activeStyle}
              >
                Home
              </NavLink>
              <NavLink
                to="/archive?page=1"
                className="nav-link"
                activeStyle={activeStyle}
              >
                Archive
              </NavLink>
              <NavLink
                to="/metrics"
                className="nav-link"
                activeStyle={activeStyle}
              >
                Metrics
              </NavLink>
              <NavLink
                to="/status"
                className="nav-link"
                activeStyle={activeStyle}
              >
                Status
              </NavLink>
            </Nav>
            <Form inline onSubmit={this.handleSubmit}>
              <FormControl
                id="query"
                type="text"
                placeholder="Search"
                className="mr-sm-2"
                value={searchQuery === undefined ? "" : searchQuery}
                onChange={this.handleChange}
              />
              <Button variant="outline-info">
                <Link
                  className="search-link"
                  to={{
                    pathname: `/search/${searchQuery}`,
                    search: `?query=${searchQuery}&page=1`,
                  }}
                >
                  Search
                </Link>
              </Button>
              {/* <Link
              className="btn search-btn"
              to={{
                pathname: `/search/${searchQuery}`,
                search: `?query=${searchQuery}&page=1`,
              }}
            >
              Search
            </Link> */}
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </React.Fragment>
    );
  }
}

export default withRouter(AppNav);
