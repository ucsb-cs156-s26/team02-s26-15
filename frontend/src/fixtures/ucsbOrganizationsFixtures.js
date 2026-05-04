const ucsbOrganizationsFixtures = {
  oneOrganization: {
    orgCode: "AACF",
    orgTranslationShort: "Asian American Christian Fellowship",
    orgTranslation: "UCSB Asian American Christian Fellowship",
    inactive: false,
  },
  threeOrganizations: [
    {
      orgCode: "AACF",
      orgTranslationShort: "Asian American Christian Fellowship",
      orgTranslation: "UCSB Asian American Christian Fellowship",
      inactive: false,
    },
    {
      orgCode: "EPIC",
      orgTranslationShort: "Epic UCSB",
      orgTranslation: "Epic at Cru UCSB",
      inactive: true,
    },
    {
      orgCode: "A2F",
      orgTranslationShort: "Acts2Fellowship",
      orgTranslation: "UCSB Acts2Fellowship",
      inactive: true,
    },
  ],
};

export { ucsbOrganizationsFixtures };
