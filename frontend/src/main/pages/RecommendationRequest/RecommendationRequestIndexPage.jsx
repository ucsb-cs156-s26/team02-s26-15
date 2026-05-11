import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { useBackend } from "main/utils/useBackend";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import { useCurrentUser, hasRole } from "main/utils/useCurrentUser";

export default function RecommendationRequestIndexPage() {
  const { data: currentUser } = useCurrentUser();

  const {
    data: recommendationRequests,
    error: _error,
    status: _status,
  } = useBackend(
    ["/api/RecommendationRequest/all"],
    { method: "GET", url: "/api/RecommendationRequest/all" },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Recommendation Requests</h1>

        {hasRole(currentUser, "ROLE_ADMIN") && (
          <Button as={Link} to="/recommendationrequest/create">
            Create Recommendation Request
          </Button>
        )}

        <RecommendationRequestTable
          recommendationRequests={recommendationRequests}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
