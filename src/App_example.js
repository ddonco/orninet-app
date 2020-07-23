import React from "react";
import ReactDOM from "react-dom";
import {
  Route,
  BrowserRouter as Router,
  Link,
  withRouter
} from "react-router-dom";
import queryString from "query-string";

const First = () => <span style={{ fontSize: "24px" }}>First</span>;
const Second = () => <span style={{ fontSize: "24px" }}>Second</span>;
const Third = () => <span style={{ fontSize: "24px" }}>Third</span>;

const itemsObj = [
  { title: "First", search: "first", component: First },
  { title: "Second", search: "second", component: Second },
  { title: "Third", search: "third", component: Third }
];

class Links extends React.Component {
  renderLi = () => item => {
    const { pathname } = this.props.location;
    return (
      <li key={item.title}>
        <Link to={`/search?tbm=${item.search}`}>{item.title}</Link>
      </li>
    );
  };
  render() {
    const { itemsObj } = this.props;
    return <ul>{itemsObj.map(this.renderLi())}</ul>;
  }
}

const LinksWithRouter = withRouter(Links);

const Routes = ({ location }) => {
  const parsed = queryString.parse(location.search);
  const target = itemsObj.find(o => o.search === parsed.tbm);
  console.log(parsed)
  console.log(target)
  return (
    <Route path={`/search`} component={target ? target.component : First} />
  );
};

const RoutesWithRouter = withRouter(Routes);

export default function App() {
  return (
    <Router>
      <div className="App">
        <LinksWithRouter itemsObj={itemsObj} />
        <RoutesWithRouter />
      </div>
    </Router>
  );
}