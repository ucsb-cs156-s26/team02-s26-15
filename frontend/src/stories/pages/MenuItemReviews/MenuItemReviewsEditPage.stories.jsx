import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

export default {
  title: "pages/MenuItemReviews/MenuItemReviewsEditPage",
  component: MenuItemReviewsEditPage,
};

const Template = () => <MenuItemReviewsEditPage storybook={true} />;

export const Default = Template.bind({});

Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),

    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),

    http.get("/api/menuitemreview", () => {
      return HttpResponse.json(menuItemReviewFixtures.threeReviews[0], {
        status: 200,
      });
    }),

    http.put("/api/menuitemreview", async ({ request }) => {
      const body = await request.json();

      window.alert(
        `PUT to /api/menuitemreview\n\n${JSON.stringify(body, null, 2)}`,
      );

      return HttpResponse.json(
        {
          id: 1,
          ...body,
        },
        { status: 200 },
      );
    }),
  ],
};
