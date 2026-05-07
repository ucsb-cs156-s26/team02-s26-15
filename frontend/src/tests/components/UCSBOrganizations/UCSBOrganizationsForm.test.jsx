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

    // Check that fields are empty (Kills mutations in defaultValues: initialContents || {})
    expect(screen.getByTestId(`${testId}-orgCode`)).toHaveValue("");
    expect(screen.getByTestId(`${testId}-orgTranslation`)).toHaveValue("");
    expect(screen.getByTestId(`${testId}-inactive`)).toHaveValue("");
  });

  test("renders correctly when passing in initialContents", async () => {
    const organization = ucsbOrganizationsFixtures.oneOrganization;
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm initialContents={organization} />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    // Verify values are correctly mapped (Kills mutations that swap or delete mapping)
    expect(screen.getByTestId(`${testId}-orgCode`)).toHaveValue(
      organization.orgCode,
    );
    expect(screen.getByTestId(`${testId}-orgTranslation`)).toHaveValue(
      organization.orgTranslation,
    );
    expect(screen.getByTestId(`${testId}-orgTranslationShort`)).toHaveValue(
      organization.orgTranslationShort,
    );
    expect(screen.getByTestId(`${testId}-inactive`)).toHaveValue(
      String(organization.inactive),
    );
  });

  test("renders correctly with a custom button label", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <UCSBOrganizationForm buttonLabel="Update" />
        </Router>
      </QueryClientProvider>,
    );
    // Kills mutation of the default parameter 'buttonLabel = "Create"'
    expect(await screen.findByText(/Update/)).toBeInTheDocument();
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

    const submitButton = await screen.findByTestId(`${testId}-submit`);
    fireEvent.click(submitButton);

    // Validation messages (Kills logic mutations in 'required' constraints)
    expect(
      await screen.findByText(/Organization Code is required/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Organization Translation is required/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Organization Translation Short is required/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Status is required/)).toBeInTheDocument();

    // Check Max Length (Kills maxLength mutation)
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
