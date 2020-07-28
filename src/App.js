import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";

import AppNav from "./components/AppNav";
import HomeCards from "./components/HomeCards";
import ArchivePage from "./components/ArchiveCards";
import SearchPage from "./components/SearchCards";
import VideoStream from "./components/VideoStream";
import SystemControl from "./components/SystemControl";
import "./App.css";

export default class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Router>
          <AppNav />
          <Container>
            <Route exact path="/" component={HomeCards} />
            <Route path={'/archive'} component={ArchivePage} />
            <Route path={'/search'} component={SearchPage} />
            <Route path={'/status'} component={SystemControl} />
            <Route path={'/stream'} component={VideoStream} />
          </Container>
        </Router>
      </div>
    );
  }
}
