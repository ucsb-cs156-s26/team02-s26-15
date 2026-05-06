import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewForm from "main/components/MenuItemReviews/MenuItemReviewForm";
import { Navigate } from "react-router";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewsCreatePage({ storybook = false }) {
  const objectToAxiosParams = (restaurant) => ({
    url: "/api/menuItemReviews/post",
    method: "POST",
    params: {
      name: menuItemReview.name,
      description: menuItemReview.description,
    },
  });

  const onSuccess = (restaurant) => {
    toast(
      `New restaurant Created - id: ${restaurant.id} name: ${restaurant.name}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/restaurants/all"], // mutation makes this key stale so that pages relying on it reload
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/restaurants" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Restaurant</h1>
        <RestaurantForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  );
}
