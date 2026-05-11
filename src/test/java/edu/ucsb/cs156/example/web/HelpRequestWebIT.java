package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_help_request() throws Exception {
    setupUser(true);

    page.getByText("HelpRequest").click();

    page.getByText("Create HelpRequest").click();
    assertThat(page.getByText("Create New HelpRequest")).isVisible();
    page.getByLabel("Requester Email").fill("kristopere2eTEST@gmail.com");
    page.getByLabel("Team ID").fill("s26-15-Test");
    page.getByLabel("Table or Breakout Room").fill("7TESTe2e");
    page.getByLabel("Request Time (iso format)").fill("2026-05-10T14:30");
    page.getByLabel("Explanation").fill("Testing for e2e case");
    page.getByLabel("Solved").check();

    page.locator("button:has-text('Create')").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .hasText("kristopere2eTEST@gmail.com");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit HelpRequest")).isVisible();
    page.getByLabel("Explanation").fill("Updated e2e explanation");
    page.locator("button:has-text('Update')").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
        .hasText("Updated e2e explanation");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .not()
        .isVisible();
  }

  @Test
  public void regular_user_cannot_create_help_request() throws Exception {
    setupUser(false);

    page.getByText("HelpRequest").click();

    assertThat(page.getByText("Create HelpRequest")).not().isVisible();
  }
}
