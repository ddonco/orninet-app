import React from 'react'
import Container from "react-bootstrap/Container";

export default class SystemControl extends React.Component {
  state = {
    yolov3Status: 'inactive',
    error: null,
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
    console.log(this.state.yolov3Status)

    return (
      <Container>
        <h3 className="text-center">
          OrniNet Status: {this.state.yolov3Status}
        </h3>
      </Container>
    )
  }
}