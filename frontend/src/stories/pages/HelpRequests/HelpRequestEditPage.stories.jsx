import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";
import { helpRequestsFixtures } from "fixtures/helpRequestsFixtures";

export default {
  title: "pages/HelpRequests/HelpRequestEditPage",
  component: HelpRequestEditPage,
};

const Template = () => <HelpRequestEditPage storybook={true} />;

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
    http.get("/api/helprequests", () => {
      return HttpResponse.json(helpRequestsFixtures.threeHelpRequests[0], {
        status: 200,
      });
    }),
    http.put("/api/helprequests", () => {
      return HttpResponse.json(
        {
          id: 17,
          requesterEmail: "cgauchoUPDATE@ucsb.edu",
          teamId: "s22-5pm-3UPDATE",
          tableOrBreakoutRoom: "7UPDATE",
          requestTime: "2023-04-20T17:35",
          explanation: "NeedUPDATE help with Swagger-ui",
          solved: true,
        },
        { status: 200 },
      );
    }),
  ],
};
