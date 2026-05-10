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
public class MenuItemReviewWebIT extends WebTestCase {

  @Test
  public void admin_user_can_create_edit_delete_menu_item_review() throws Exception {
    setupUser(true);

    page.getByText("Menu Item Reviews").click();

    page.getByText("Create MenuItemReview").click();

    assertThat(page.getByText("Create New MenuItemReview")).isVisible();

    page.getByLabel("Item Id").fill("1");
    page.getByLabel("Reviewer Email").fill("test@example.com");
    page.getByLabel("Stars").fill("5");
    page.getByLabel("Date Reviewed").fill("2026-05-10T12:30");
    page.getByLabel("Comments").fill("Great food");

    page.getByTestId("MenuItemReviewForm-submit").click();

    assertThat(page.getByText("Great food")).isVisible();

    page.getByText("Edit").first().click();

    assertThat(page.getByText("Edit MenuItemReview")).isVisible();

    page.getByLabel("Comments").fill("Updated review");

    page.getByTestId("MenuItemReviewForm-submit").click();

    assertThat(page.getByText("Updated review")).isVisible();

    page.getByText("Delete").first().click();

    assertThat(page.getByText("Updated review")).not().isVisible();
  }

  @Test
  public void admin_user_can_see_create_menu_item_review_button() throws Exception {
    setupUser(true);

    page.getByText("Menu Item Reviews").click();

    assertThat(page.getByText("Create MenuItemReview")).isVisible();
  }

  @Test
  public void regular_user_cannot_create_menu_item_review() throws Exception {
    setupUser(false);

    page.getByText("Menu Item Reviews").click();

    assertThat(page.getByText("Create MenuItemReview")).not().isVisible();
  }
}
