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
public class ArticlesWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_article() throws Exception {
    setupUser(true);

    page.getByText("Articles").click();

    page.getByText("Create Article").click();
    assertThat(page.getByText("Create New Article")).isVisible();
    page.getByTestId("ArticleForm-title").fill("How to Learn React");
    page.getByLabel("URL").fill("https://react.dev/learn");
    page.getByLabel("Explanation").fill("Official React tutorial");
    page.getByLabel("Email").fill("xuanbo@ucsb.edu");
    page.getByLabel("Date Added (in UTC)").fill("2026-05-01T12:00");
    page.locator("button[type='submit']").click();

    assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).hasText("How to Learn React");

    page.getByTestId("ArticleTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit Article")).isVisible();
    page.getByTestId("ArticleForm-title").fill("How to Master React");
    page.locator("button[type='submit']").click();

    assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title"))
        .hasText("How to Master React");

    page.getByTestId("ArticleTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_article() throws Exception {
    setupUser(false);

    page.getByText("Articles").click();

    assertThat(page.getByText("Create Article")).not().isVisible();
    assertThat(page.getByTestId("ArticleTable-cell-row-0-col-title")).not().isVisible();
  }
}
