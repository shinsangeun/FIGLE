import React from "react";

// reactstrap components
import { Container } from "reactstrap";

class UserHeader extends React.Component {
    render() {
    return (
      <>
        <div
          className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
          style={{
            minHeight: "100px",
            backgroundImage: "",
            backgroundSize: "cover",
            backgroundPosition: "center top"
          }}
        >
          {/* Mask */}
          <span className="mask bg-gradient-default opacity-8" />
          {/* Header container */}
          <Container className="d-flex align-items-center" fluid>
          </Container>
        </div>
      </>
    );
  }
}

export default UserHeader;
