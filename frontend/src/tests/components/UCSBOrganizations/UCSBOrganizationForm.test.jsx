import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import UCSBOrganizationForm from "main/components/UCSBOrganizations/UCSBOrganizationForm";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("UCSBOrganizationForm tests", () => {
  const queryClient = new QueryClient();

  const testId = "UCSBOrganizationForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expect(screen.getByText("Organization Translation")).toBeInTheDocument();
    expect(screen.getByText("Organization Translation Short")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm
            initialContents={ucsbOrganizationsFixtures.oneOrganization}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create|Update/)).toBeInTheDocument();

    expect(screen.getByText("Organization Translation")).toBeInTheDocument();
    expect(screen.getByText("Organization Translation Short")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();

    expect(
      await screen.findByTestId(`${testId}-orgCode`)
    ).toBeInTheDocument();

    expect(screen.getByText("Organization Code")).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    const cancelButton = await screen.findByTestId(`${testId}-cancel`);
    fireEvent.click(cancelButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith(-1)
    );
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    const submitButton = await screen.findByText(/Create/);
    fireEvent.click(submitButton);

    // required validations
    expect(
      await screen.findByText(/orgTranslation is required/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/orgTranslationShort is required/)
    ).toBeInTheDocument();

    // max length validation on orgTranslation
    const nameInput = screen.getByTestId(`${testId}-orgTranslation`);

    fireEvent.change(nameInput, {
      target: { value: "a".repeat(256) },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Max length 30 characters/)
      ).toBeInTheDocument();
    });
  });
});