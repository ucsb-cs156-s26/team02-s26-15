import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";
import { articleFixtures } from "fixtures/articleFixtures";

export default {
  title: "pages/Articles/ArticlesEditPage",
  component: ArticlesEditPage,
};

const Template = () => <ArticlesEditPage storybook={true} />;

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
    http.get("/api/articles", () => {
      return HttpResponse.json(articleFixtures.threeArticles[0], {
        status: 200,
      });
    }),
    http.put("/api/articles", () => {
      return HttpResponse.json(
        {
          id: 1,
          title: "How to Learn React Updated",
          url: "https://react.dev/learn/updated",
          explanation: "Updated React tutorial",
          email: "xuanbo@ucsb.edu",
          dateAdded: "2026-05-02T14:30Z",
        },
        { status: 200 },
      );
    }),
  ],
};
