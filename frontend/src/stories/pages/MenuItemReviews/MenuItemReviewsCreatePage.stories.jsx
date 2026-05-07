import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";

export default {
  title: "pages/MenuItemReviews/MenuItemReviewsCreatePage",
  component: MenuItemReviewsCreatePage,
};

const Template = () => <MenuItemReviewsCreatePage storybook={true} />;

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
    http.post("/api/menuitemreview/post", () => {
      return HttpResponse.json(
        {
          id: 1,
          itemId: 2,
          reviewerEmail: "test@ucsb.edu",
          stars: 5,
          dateReviewed: "2026-05-04T15:10",
          comments: "Very good food!",
        },
        { status: 200 },
      );
    }),
  ],
};
