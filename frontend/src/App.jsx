import { Routes, Route } from "react-router";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import RestaurantIndexPage from "main/pages/Restaurants/RestaurantIndexPage";
import RestaurantCreatePage from "main/pages/Restaurants/RestaurantCreatePage";
import RestaurantEditPage from "main/pages/Restaurants/RestaurantEditPage";

<<<<<<< HEAD
import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";
=======
import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";
>>>>>>> 0267a31352bbfe5fa99902b981ca71c95d40126f

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { hasRole, useCurrentUser } from "main/utils/useCurrentUser";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const currentUser = useCurrentUser();

  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/profile" element={<ProfilePage />} />
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <Route exact path="/admin/users" element={<AdminUsersPage />} />
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route exact path="/ucsbdates" element={<UCSBDatesIndexPage />} />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/ucsbdates/edit/:id"
            element={<UCSBDatesEditPage />}
          />
          <Route
            exact
            path="/ucsbdates/create"
            element={<UCSBDatesCreatePage />}
          />
        </>
      )}

      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route exact path="/articles" element={<ArticlesIndexPage />} />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/articles/edit/:id"
            element={<ArticlesEditPage />}
          />
          <Route
            exact
            path="/articles/create"
            element={<ArticlesCreatePage />}
          />
        </>
      )}

      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route exact path="/restaurants" element={<RestaurantIndexPage />} />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/restaurants/edit/:id"
            element={<RestaurantEditPage />}
          />
          <Route
            exact
            path="/restaurants/create"
            element={<RestaurantCreatePage />}
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route
            exact
<<<<<<< HEAD
            path="/diningcommonsmenuitem"
            element={<UCSBDiningCommonsMenuItemIndexPage />}
=======
            path="/ucsborganizations"
            element={<UCSBOrganizationsIndexPage />}
>>>>>>> 0267a31352bbfe5fa99902b981ca71c95d40126f
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
<<<<<<< HEAD
            path="/diningcommonsmenuitem/edit/:id"
            element={<UCSBDiningCommonsMenuItemEditPage />}
          />
          <Route
            exact
            path="/diningcommonsmenuitem/create"
            element={<UCSBDiningCommonsMenuItemCreatePage />}
=======
            path="/ucsborganizations/edit/:orgCode"
            element={<UCSBOrganizationsEditPage />}
          />
          <Route
            exact
            path="/ucsborganizations/create"
            element={<UCSBOrganizationsCreatePage />}
>>>>>>> 0267a31352bbfe5fa99902b981ca71c95d40126f
          />
        </>
      )}
      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route exact path="/placeholder" element={<PlaceholderIndexPage />} />
        </>
      )}
      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route
            exact
            path="/placeholder/edit/:id"
            element={<PlaceholderEditPage />}
          />
          <Route
            exact
            path="/placeholder/create"
            element={<PlaceholderCreatePage />}
          />
        </>
      )}
    </Routes>
  );
}

export default App;
