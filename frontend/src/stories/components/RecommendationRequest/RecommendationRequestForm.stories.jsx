import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";

export default {
  title: "components/RecommendationRequest/RecommendationRequestForm",
  component: RecommendationRequestForm,
};

const Template = (args) => {
  return <RecommendationRequestForm {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Show = Template.bind({});
Show.args = {
  initialContents: recommendationRequestFixtures.oneRecommendationRequest,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
