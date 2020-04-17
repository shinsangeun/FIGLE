import React from "react";

// reactstrap components
import {NavItem, NavLink, Nav, Container, Row, Col, Button} from "reactstrap";

class Login extends React.Component {
  render() {
    return (
      <>
        <footer className="py-5">
          <Container>
            <Row className="align-items-center justify-content-xl-between">
              <Col xl="6">
                <div className="copyright text-center text-xl-left text-muted">
                  © 2020{" "}
                    FIGLE 
                </div>
              </Col>
              <Col xl="6">
                <Nav className="nav-footer justify-content-center justify-content-xl-end">
                  <Button
                      className="btn-neutral btn-icon"
                      color="default"
                      href="https://github.com/gksthf2271/FIGLE/"
                  >
                  <span className="btn-inner--icon">
                    <img
                        alt="..."
                        src={require("assets/img/icons/common/github.svg")}
                    />
                  </span>
                    <span className="btn-inner--text">Github</span>
                  </Button>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Login;
