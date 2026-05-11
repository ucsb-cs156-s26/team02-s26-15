import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";

describe("RecommendationRequestIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);
  const testId = "RecommendationRequestTable";

  const recommendationRequests = [
    {
      id: 1,
      requesterEmail: "student@ucsb.edu",
      professorEmail: "professor@ucsb.edu",
      explanation: "I need a recommendation letter.",
      dateRequested: "2026-05-10T12:00:00",
      dateNeeded: "2026-06-01T12:00:00",
      done: false,
    },
  ];

  const setupCurrentUser = (roles) => {
  axiosMock.onGet("/api/currentUser").reply(200, {
    user: {
      email: "pconrad.cis@gmail.com",
    },
    roles,
  });
};

  const setupCommonMocks = () => {
    axiosMock.reset();
    axiosMock.resetHistory();

    axiosMock.onGet("/api/systemInfo").reply(200, {
      springH2ConsoleEnabled: false,
      showSwaggerUILink: false,
    });

    axiosMock
      .onGet("/api/RecommendationRequest/all")
      .reply(200, recommendationRequests);
  };

  const renderPage = () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  test("Renders expected content for admin user", async () => {
    setupCommonMocks();
    setupCurrentUser([
      { authority: "ROLE_USER" },
      { authority: "ROLE_ADMIN" },
    ]);

    renderPage();

    await screen.findByText("Recommendation Requests");

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-requesterEmail`),
    ).toHaveTextContent("student@ucsb.edu");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-professorEmail`),
    ).toHaveTextContent("professor@ucsb.edu");

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`),
    ).toHaveTextContent("I need a recommendation letter.");

    expect(screen.getByText("Create Recommendation Request")).toBeInTheDocument();

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(3);
    });
  });

  test("Does not render create button for regular user", async () => {
    setupCommonMocks();
    setupCurrentUser([{ authority: "ROLE_USER" }]);

    renderPage();

    await screen.findByText("Recommendation Requests");

    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-requesterEmail`),
    ).toHaveTextContent("student@ucsb.edu");

    expect(
      screen.queryByText("Create Recommendation Request"),
    ).not.toBeInTheDocument();
  });
});
