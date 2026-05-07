import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/menuItemReviewUtils";
import { useNavigate } from "react-router";
import { hasRole } from "main/utils/useCurrentUser";

export default function MenuItemReviewTable({
  menuItemReviews,
  currentUser,
  testIdPrefix = "MenuItemReviewTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/menuitemreviews/edit/${cell.row.original.id}`);
  };

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    ["/api/menuitemreview/all"],
  );

  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      header: "id",
      accessorKey: "id",
    },
    {
      header: "ItemId",
      accessorKey: "itemId",
    },
    {
      header: "Reviewer Email",
      accessorKey: "reviewerEmail",
    },
    {
      header: "Stars",
      accessorKey: "stars",
    },
    {
      header: "Date Reviewed",
      accessorKey: "dateReviewed",
    },
    {
      header: "Comments",
      accessorKey: "comments",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  return (
    <OurTable data={menuItemReviews} columns={columns} testid={testIdPrefix} />
  );
}
