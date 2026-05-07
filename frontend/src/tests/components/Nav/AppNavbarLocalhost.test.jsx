import { render, screen } from "@testing-library/react";
import AppNavbarLocalhost from "../../../main/components/Nav/AppNavbarLocalhost";

describe("AppNavbarLocalhost tests", () => {
  test("renders correctly", async () => {
    render(<AppNavbarLocalhost url="http://localhost:3000" />);

    expect(screen.getByTestId("AppNavbarLocalhost")).toBeInTheDocument();

    expect(screen.getByTestId("AppNavbarLocalhost-message1")).toHaveTextContent(
      "Running on http://localhost:3000 with no backend.",
    );

    expect(screen.getByTestId("AppNavbarLocalhost-message2")).toHaveTextContent(
      "You probably want http://localhost:8080 instead.",
    );
  });
});
