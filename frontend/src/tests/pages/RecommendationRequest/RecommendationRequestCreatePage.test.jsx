import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("RecommendationRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /recommendationrequest", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 17,
      requesterEmail: "student@ucsb.edu",
      professorEmail: "prof@ucsb.edu",
      explanation: "Need a rec letter for grad school",
      dateRequested: "2025-01-01T12:00",
      dateNeeded: "2025-02-01T12:00",
      done: false,
    };

    axiosMock
      .onPost("/api/RecommendationRequest/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("RecommendationRequestForm-requesterEmail"),
      ).toBeInTheDocument();
    });

    const requesterEmailInput = screen.getByTestId(
      "RecommendationRequestForm-requesterEmail",
    );
    const professorEmailInput = screen.getByTestId(
      "RecommendationRequestForm-professorEmail",
    );
    const explanationInput = screen.getByTestId(
      "RecommendationRequestForm-explanation",
    );
    const dateRequestedInput = screen.getByTestId(
      "RecommendationRequestForm-dateRequested",
    );
    const dateNeededInput = screen.getByTestId(
      "RecommendationRequestForm-dateNeeded",
    );
    const doneInput = screen.getByTestId("RecommendationRequestForm-done");
    const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

    fireEvent.change(requesterEmailInput, {
      target: { value: "student@ucsb.edu" },
    });
    fireEvent.change(professorEmailInput, {
      target: { value: "prof@ucsb.edu" },
    });
    fireEvent.change(explanationInput, {
      target: { value: "Need a rec letter for grad school" },
    });
    fireEvent.change(dateRequestedInput, {
      target: { value: "2025-01-01T12:00" },
    });
    fireEvent.change(dateNeededInput, {
      target: { value: "2025-02-01T12:00" },
    });
    fireEvent.click(doneInput);
    fireEvent.click(submitButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "student@ucsb.edu",
      professorEmail: "prof@ucsb.edu",
      explanation: "Need a rec letter for grad school",
      dateRequested: "2025-01-01T12:00",
      dateNeeded: "2025-02-01T12:00",
      done: true,
    });

    expect(mockToast).toBeCalledWith(
      "New recommendation request Created - id: 17",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });
});
