import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewsCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";
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

describe("MenuItemReviewsCreatePage tests", () => {
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

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuItemReviews", async () => {
    const queryClient = new QueryClient();

    const menuItemReview = {
      id: 3,
      itemId: 2,
      reviewerEmail: "katelyndang@ucsb.edu",
      stars: 5,
      dateReviewed: "2026-05-04T15:10",
      comments: "Very good food!",
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, menuItemReview);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewsCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Item Id"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("Reviewer Email"), {
      target: { value: "katelyndang@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Stars"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("Date Reviewed (In UTC)"), {
      target: { value: "2026-05-04T15:10" },
    });
    fireEvent.change(screen.getByLabelText("Comments"), {
      target: { value: "Very good food!" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "2",
      reviewerEmail: "katelyndang@ucsb.edu",
      stars: "5",
      dateReviewed: "2026-05-04T15:10",
      comments: "Very good food!",
    });

    expect(mockToast).toBeCalledWith(
      "New MenuItemReview Created - id: 3 itemId: 2",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/menuItemReviews" });
  });
});
