import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Item Id",
    "Reviewer Email",
    "Stars",
    "Date Reviewed (In UTC)",
    "Comments",
  ];
  const testId = "MenuItemReviewForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-itemId`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-reviewerEmail`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-stars`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-dateReviewed`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-comments`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm
            initialContents={menuItemReviewFixtures.oneReview}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText("Id")).toBeInTheDocument();

    expect(screen.getByTestId(`${testId}-id`)).toHaveValue(1);
    expect(screen.getByTestId(`${testId}-itemId`)).toHaveValue(2);
    expect(screen.getByTestId(`${testId}-reviewerEmail`)).toHaveValue(
      "katelyndang@ucsb.edu",
    );
    expect(screen.getByTestId(`${testId}-stars`)).toHaveValue(5);
    expect(screen.getByTestId(`${testId}-dateReviewed`)).toHaveValue(
      "2026-05-04T15:10",
    );
    expect(screen.getByTestId(`${testId}-comments`)).toHaveValue(
      "Very good food!",
    );
  });

  test("renders correctly when initialContents has no dateReviewed", async () => {
    const initialContents = {
      ...menuItemReviewFixtures.oneReview,
      dateReviewed: undefined,
    };

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm initialContents={initialContents} />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-dateReviewed`)).toHaveValue("");
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId(`${testId}-cancel`));

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Create/));

    await screen.findByText(/Item Id is required/);
    expect(screen.getByText(/Reviewer Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Stars is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/Comments is required/)).toBeInTheDocument();
  });
});
