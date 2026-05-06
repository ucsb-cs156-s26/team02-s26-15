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

  const expectedHeaders = [
    "Organization Code",
    "Organization Translation",
    "Organization Translation Short",
  ];
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

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-orgCode`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-orgTranslationShort`),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-orgTranslation`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-inactive`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-cancel`)).toBeInTheDocument();
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

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-orgCode`)).toBeInTheDocument();
    expect(
      screen.getByTestId(`${testId}-orgTranslationShort`),
    ).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-orgTranslation`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-inactive`)).toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Organization Code is required/);
    expect(
      screen.getByText(/Organization Translation is required/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Organization Translation Short is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Status is required/)).toBeInTheDocument();

    const orgTranslationInput = screen.getByTestId(`${testId}-orgTranslation`);
    fireEvent.change(orgTranslationInput, {
      target: { value: "a".repeat(256) },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 255 characters/)).toBeInTheDocument();
    });
  });

  test("selects the correct option in the inactive dropdown", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm />
        </Router>
      </QueryClientProvider>,
    );

    const inactiveDropdown = screen.getByTestId(`${testId}-inactive`);

    fireEvent.change(inactiveDropdown, { target: { value: "true" } });
    expect(inactiveDropdown.value).toBe("true");

    fireEvent.change(inactiveDropdown, { target: { value: "false" } });
    expect(inactiveDropdown.value).toBe("false");
  });
});
