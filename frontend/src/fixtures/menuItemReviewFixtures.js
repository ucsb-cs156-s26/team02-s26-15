const menuItemReviewFixtures = {
  oneReview: {
    id: 1,
    itemId: 2,
    reviewerEmail: "katelyndang@ucsb.edu",
    stars: 5,
    dateReviewed: "2026-05-04T15:10:10",
    comments: "Very good food!",
  },
  threeReviews: [
    {
      id: 1,
      itemId: 2,
      reviewerEmail: "katelyndang@ucsb.edu",
      stars: 5,
      dateReviewed: "2026-05-04T15:10:10",
      comments: "Very good food!",
    },
    {
      id: 2,
      itemId: 1,
      reviewerEmail: "katelyndang@ucsb.edu",
      stars: 2,
      dateReviewed: "2025-06-10T16:25:10",
      comments: "It was okay",
    },
    {
      id: 3,
      itemId: 3,
      reviewerEmail: "katelyndang@ucsb.edu",
      stars: 4,
      dateReviewed: "2025-05-06T18:21:15",
      comments: "Would eat again",
    },
  ],
};

export { menuItemReviewFixtures };
