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

import UCSBOrganizationsIndexPage from "main/pages/UCSBOrganizations/UCSBOrganizationsIndexPage";
import UCSBOrganizationsCreatePage from "main/pages/UCSBOrganizations/UCSBOrganizationsCreatePage";
import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

import ArticlesIndexPage from "main/pages/Articles/ArticlesIndexPage";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import UCSBDiningCommonsMenuItemIndexPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemIndexPage";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
import UCSBDiningCommonsMenuItemEditPage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemEditPage";

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

          <Route
            path="/ucsborganizations"
            element={<UCSBOrganizationsIndexPage />}
          />

          <Route path="/placeholder" element={<PlaceholderIndexPage />} />

          <Route path="/articles" element={<ArticlesIndexPage />} />

          <Route
            path="/diningcommonsmenuitem"
            element={<UCSBDiningCommonsMenuItemIndexPage />}
          />
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
            exact
            path="/ucsborganizations/edit/:id"
            element={<UCSBOrganizationsEditPage />}
          />
          <Route
            path="/ucsborganizations/create"
            element={<UCSBOrganizationsCreatePage />}
          />

          <Route
            path="/placeholder/edit/:id"
            element={<PlaceholderEditPage />}
          />
          <Route
            path="/placeholder/create"
            element={<PlaceholderCreatePage />}
          />

          <Route path="/articles/edit/:id" element={<ArticlesEditPage />} />
          <Route path="/articles/create" element={<ArticlesCreatePage />} />

          <Route
            path="/diningcommonsmenuitem/edit/:id"
            element={<UCSBDiningCommonsMenuItemEditPage />}
          />
          <Route
            path="/diningcommonsmenuitem/create"
            element={<UCSBDiningCommonsMenuItemCreatePage />}
          />
        </>
      )}
    </Routes>
  );
}

export default App;
