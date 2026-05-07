import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "tests/testutils/mockConsole";

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
    useParams: vi.fn(() => ({
      id: 17,
    })),
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

let axiosMock;

describe("MenuItemReviewsEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByText("Edit MenuItemReview");
      expect(
        screen.queryByTestId("MenuItemReviewForm-itemId"),
      ).not.toBeInTheDocument();

      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    beforeEach(() => {
      axiosMock = new AxiosMockAdapter(axios);
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);

      axiosMock
        .onGet("/api/menuitemreview", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          itemId: 2,
          reviewerEmail: "katelyndang@ucsb.edu",
          stars: 5,
          dateReviewed: "2026-05-04T15:10:10",
          comments: "Very good food!",
        });

      axiosMock.onPut("/api/menuitemreview").reply(200, {
        id: 17,
        itemId: 3,
        reviewerEmail: "updated@ucsb.edu",
        stars: 4,
        dateReviewed: "2026-05-04T15:10",
        comments: "Updated comment",
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    test("Is populated with the data provided", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId(
        "MenuItemReviewForm-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReviewForm-dateReviewed",
      );
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue(17);
      expect(itemIdField).toBeInTheDocument();
      expect(itemIdField).toHaveValue(2);
      expect(reviewerEmailField).toBeInTheDocument();
      expect(reviewerEmailField).toHaveValue("katelyndang@ucsb.edu");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue(5);
      expect(dateReviewedField).toBeInTheDocument();
      expect(dateReviewedField).toHaveValue("2026-05-04T15:10");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("Very good food!");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemIdField, {
        target: { value: "3" },
      });
      fireEvent.change(reviewerEmailField, {
        target: { value: "updated@ucsb.edu" },
      });
      fireEvent.change(starsField, {
        target: { value: "4" },
      });
      fireEvent.change(dateReviewedField, {
        target: { value: "2026-05-04T15:10" },
      });
      fireEvent.change(commentsField, {
        target: { value: "Updated comment" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReview Updated - id: 17 itemId: 3",
      );

      expect(mockNavigate).toBeCalledWith({ to: "/menuItemReviews" });

      expect(axiosMock.history.put.length).toBe(1);
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "3",
          reviewerEmail: "updated@ucsb.edu",
          stars: "4",
          dateReviewed: "2026-05-04T15:10",
          comments: "Updated comment",
        }),
      );
    });

    test("Changes when you click Update", async () => {
      const queryClient = new QueryClient();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
      const reviewerEmailField = screen.getByTestId(
        "MenuItemReviewForm-reviewerEmail",
      );
      const starsField = screen.getByTestId("MenuItemReviewForm-stars");
      const dateReviewedField = screen.getByTestId(
        "MenuItemReviewForm-dateReviewed",
      );
      const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toHaveValue(17);
      expect(itemIdField).toHaveValue(2);
      expect(reviewerEmailField).toHaveValue("katelyndang@ucsb.edu");
      expect(starsField).toHaveValue(5);
      expect(dateReviewedField).toHaveValue("2026-05-04T15:10");
      expect(commentsField).toHaveValue("Very good food!");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(itemIdField, {
        target: { value: "3" },
      });
      fireEvent.change(reviewerEmailField, {
        target: { value: "updated@ucsb.edu" },
      });
      fireEvent.change(starsField, {
        target: { value: "4" },
      });
      fireEvent.change(dateReviewedField, {
        target: { value: "2026-05-04T15:10" },
      });
      fireEvent.change(commentsField, {
        target: { value: "Updated comment" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "MenuItemReview Updated - id: 17 itemId: 3",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/menuItemReviews" });
    });
  });
});
