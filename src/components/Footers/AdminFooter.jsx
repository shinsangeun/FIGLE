import React from "react";

// reactstrap components
import { Row } from "reactstrap";

class Footer extends React.Component {

  constructor(props)
  {
    super(props);
  }
  
  render() {
    return (
      <footer className="footer">
        <Row className="align-items-center justify-content-xl-between">
        </Row>
      </footer>
    );
  }
}

export default Footer;
