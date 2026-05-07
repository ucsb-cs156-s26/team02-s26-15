import React from "react";
import { Link } from "react-router";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useSystemInfo } from "main/utils/systemInfo";
import { hasRole } from "main/utils/useCurrentUser";

export default function AppNavbar({
  currentUser,
  systemInfo,
  doLogout,
  oauthLogin,
}) {
  const systemInfoDataFromHook = useSystemInfo();
  const systemInfoData = systemInfo || systemInfoDataFromHook;

  return (
    <Navbar expand="lg" data-testid="AppNavbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Team02
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser && currentUser.loggedIn ? (
              <>
                <Nav.Link as={Link} to="/ucsbdates">
                  UCSB Dates
                </Nav.Link>

                <Nav.Link as={Link} to="/restaurants">
                  Restaurants
                </Nav.Link>

                <Nav.Link as={Link} to="/menuItemReviews">
                  Menu Item Reviews
                </Nav.Link>

                <Nav.Link as={Link} to="/ucsborganizations">
                  UCSB Organizations
                </Nav.Link>

                <Nav.Link as={Link} to="/placeholder">
                  Placeholder
                </Nav.Link>

                {hasRole(currentUser, "ROLE_ADMIN") && (
                  <Nav.Link as={Link} to="/admin/users">
                    Admin
                  </Nav.Link>
                )}

                {systemInfoData?.springH2ConsoleEnabled && (
                  <Nav.Link href="/h2-console">H2Console</Nav.Link>
                )}

                {systemInfoData?.showSwaggerUILink && (
                  <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
                )}
              </>
            ) : (
              <></>
            )}
          </Nav>

          <Nav className="ml-auto">
            {currentUser && currentUser.loggedIn ? (
              <>
                <Navbar.Text className="me-3">
                  Welcome, {currentUser.root.user.email}
                </Navbar.Text>
                <Button onClick={doLogout}>Log Out</Button>
              </>
            ) : (
              <Button href={oauthLogin}>Log In</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
