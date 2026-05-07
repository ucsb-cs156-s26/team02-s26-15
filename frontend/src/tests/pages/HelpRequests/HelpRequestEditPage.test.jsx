import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

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
describe("HelpRequestEditPage tests", () => {
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
      axiosMock.onGet("/api/helprequest", { params: { id: 17 } }).timeout();
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit HelpRequest");
      expect(screen.queryByTestId("HelpRequest-requesterEmail")).not.toBeInTheDocument();
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "cgaucho@ucsb.edu",
        teamId: "s22-5pm-3",
        tableOrBreakoutRoom: "7",
        requestTime: "2022-04-20T17:35",
        explanation: "Need help with Swagger-ui",
        solved: false,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: 17,
        requesterEmail: "cgauchoUPDATE@ucsb.edu",
        teamId: "s22-5pm-3UPDATE",
        tableOrBreakoutRoom: "7UPDATE",
        requestTime: "2023-04-20T17:35",
        explanation: "NeedUPDATE help with Swagger-ui",
        solved: true,
      });
    });

    afterEach(() => {
      mockToast.mockClear();
      mockNavigate.mockClear();
      axiosMock.restore();
      axiosMock.resetHistory();
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByLabelText("Requester Email");
      const teamIdField = screen.getByLabelText("Team ID");
      const tableOrBreakoutRoomField = screen.getByLabelText("Table or Breakout Room");
      const requestTimeField = screen.getByLabelText("Request Time (iso format)");
      const explanationField = screen.getByLabelText("Explanation");
      const solvedField = screen.getByLabelText("Solved");

      const submitButton = screen.getByText("Update")

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("cgaucho@ucsb.edu");

      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("s22-5pm-3");

      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("7");

      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2022-04-20T17:35");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("Need help with Swagger-ui");

      expect(solvedField).toBeInTheDocument();
      expect(solvedField).not.toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "cgauchoUPDATE@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "s22-5pm-3UPDATE" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "7UPDATE" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "s22-5pm-3UPDATE" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2023-04-20T17:35" },
      });
      fireEvent.change(explanationField, {
        target: { value: "NeedUPDATE help with Swagger-ui" },
      });
      fireEvent.click(solvedField);
      expect(solvedField).toBeChecked();

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "HelpRequest Updated - id: 17 requesterEmail: cgauchoUPDATE@ucsb.edu",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequest" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
        requesterEmail: "cgauchoUPDATE@ucsb.edu",
        teamId: "s22-5pm-3UPDATE",
        tableOrBreakoutRoom: "7UPDATE",
        requestTime: "2023-04-20T17:35",
        explanation: "NeedUPDATE help with Swagger-ui",
        solved: true,
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequest" });
    });
  });
});
