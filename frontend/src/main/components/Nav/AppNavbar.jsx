import React from "react";
import { Link } from "react-router";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { useSystemInfo } from "main/utils/systemInfo";
import { hasRole } from "main/utils/useCurrentUser";

function AppNavbarLocalhost() {
  return (
    <Navbar.Text data-testid="AppNavbarLocalhost" className="me-3">
      <span data-testid="AppNavbarLocalhost-message1">
        Running on http://localhost:3000/ with no backend.
      </span>
      <br />
      <span data-testid="AppNavbarLocalhost-message2">
        You probably want http://localhost:8080 instead.
      </span>
    </Navbar.Text>
  );
}

export default function AppNavbar({
  currentUser,
  systemInfo,
  doLogout,
  oauthLogin = "/oauth2/authorization/google",
}) {
  const systemInfoFromHook = useSystemInfo();
  const systemInfoData = systemInfo || systemInfoFromHook;

  const isLocalhost =
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1") &&
    window.location.port === "3000";

  return (
    <Navbar expand="lg" data-testid="AppNavbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Team02
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {currentUser && currentUser.loggedIn && (
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

                <Nav.Link as={Link} to="/placeholder">
                  Placeholder
                </Nav.Link>

                {hasRole(currentUser, "ROLE_ADMIN") && (
                  <NavDropdown
                    title="Admin"
                    id="appnavbar-admin-dropdown"
                    data-testid="appnavbar-admin-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/admin/users">
                      Users
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {systemInfoData?.springH2ConsoleEnabled && (
                  <Nav.Link href="/h2-console">H2Console</Nav.Link>
                )}

                {systemInfoData?.showSwaggerUILink && (
                  <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
                )}
              </>
            )}
          </Nav>

          <Nav className="ml-auto">
            {isLocalhost && <AppNavbarLocalhost />}

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
