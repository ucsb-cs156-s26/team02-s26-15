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

import MenuItemReviewsIndexPage from "main/pages/MenuItemReviews/MenuItemReviewsIndexPage";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

import { hasRole, useCurrentUser } from "main/utils/useCurrentUser";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const currentUser = useCurrentUser();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {hasRole(currentUser, "ROLE_ADMIN") && (
        <Route path="/admin/users" element={<AdminUsersPage />} />
      )}

      {hasRole(currentUser, "ROLE_USER") && (
        <>
          <Route path="/ucsbdates" element={<UCSBDatesIndexPage />} />
          <Route path="/restaurants" element={<RestaurantIndexPage />} />
          <Route
            path="/menuItemReviews"
            element={<MenuItemReviewsIndexPage />}
          />
          <Route path="/placeholder" element={<PlaceholderIndexPage />} />
        </>
      )}

      {hasRole(currentUser, "ROLE_ADMIN") && (
        <>
          <Route path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
          <Route path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />

          <Route
            path="/restaurants/edit/:id"
            element={<RestaurantEditPage />}
          />
          <Route
            path="/restaurants/create"
            element={<RestaurantCreatePage />}
          />

          <Route
            path="/menuItemReviews/edit/:id"
            element={<MenuItemReviewsEditPage />}
          />
          <Route
            path="/menuItemReviews/create"
            element={<MenuItemReviewsCreatePage />}
          />

          <Route
            path="/placeholder/edit/:id"
            element={<PlaceholderEditPage />}
          />
          <Route
            path="/placeholder/create"
            element={<PlaceholderCreatePage />}
          />
        </>
      )}
    </Routes>
  );
}

export default App;
