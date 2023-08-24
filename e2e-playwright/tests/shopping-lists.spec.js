const { test, expect } = require("@playwright/test");

test("Main page has expected title, headings, and link.", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Shared shopping lists");
  await expect(page.locator("h1")).toHaveText("Lists");

  // Check the link in the <a> element
  const linkElement = await page.locator("a");
  await expect(linkElement).toHaveText("Lists");
  await expect(linkElement).toHaveAttribute("href", "/lists"); 
});

test("Can create and list a list.", async ({ page }) => {
  await page.goto("/lists");
  const listName = `My task: ${Math.random()}`;
  await page.locator("input[type=text]").type(listName);
  await page.locator("input[type=submit] >> text='Create list!'").click();
  await expect(page.locator(`a >> text='${listName}'`)).toHaveText(listName);
});

test("Can deactivate a list.", async ({ page }) => {
  await page.goto("/lists");
  const listName = `My task: ${Math.random()}`;
  await page.locator("input[type=text]").type(listName);
  await page.locator("input[type=submit] >> text='Create list!'").click();
  
  // Use the parent li element as the scope for locating the "Deactivate list!" button
  const formElement = page.locator(`li[id='${listName}']`);
  await formElement.locator("input[type=submit] >> text='Deactivate list!'").click();

  const element = page.locator(`a >> text='${listName}'`);
  await expect(element).not.toBeVisible();
});

test("Can show a single shopping list.", async ({page}) => {
  await page.goto("/lists");
  const listName = `My task: ${Math.random()}`;
  await page.locator("input[type=text]").type(listName);
  await page.locator("input[type=submit] >> text='Create list!'").click();

  //Go to the page for a specific list
  await page.locator(`a >> text='${listName}'`).click();
  await expect(page.locator("h1")).toHaveText(`${listName}`);

});

test("Can add and list items for a single shopping list.", async ({page}) => {
  await page.goto("/lists");
  const listName = `My task: ${Math.random()}`;
  await page.locator("input[type=text]").type(listName);
  await page.locator("input[type=submit] >> text='Create list!'").click();

  //Go to the page for a specific list
  await page.locator(`a >> text='${listName}'`).click();
  await expect(page.locator("h1")).toHaveText(`${listName}`);

  //Add a random item and check whether the item appears on the page
  const itemName = `My item: ${Math.random()}`;
  await page.locator("input[type=text]").type(itemName);
  await page.locator("input[type=submit] >> text='Add item!'").click();
  await expect(page.locator(`text=${itemName}`)).toBeVisible;

});

test("Can mark items in the shopping list as collected", async ({page}) => {
  await page.goto("/lists");
  const listName = `My task: ${Math.random()}`;
  await page.locator("input[type=text]").type(listName);
  await page.locator("input[type=submit] >> text='Create list!'").click();

  //Go to the page for a specific list
  await page.locator(`a >> text='${listName}'`).click();
  await expect(page.locator("h1")).toHaveText(`${listName}`);

  //Add a random item and check whether the item appears on the page
  const itemName = `My item: ${Math.random()}`;
  await page.locator("input[type=text]").type(itemName);
  await page.locator("input[type=submit] >> text='Add item!'").click();
  await expect(page.locator(`text=${itemName}`)).toBeVisible;

  // Use the parent li element as the scope for locating the "Deactivate list!" button 
  const formElement = page.locator(`li[id='${itemName}']`);
  await formElement.locator("input[type=submit] >> text='Mark collected!'").click();

  await expect(page.locator(`del >> text=${itemName}`)).toHaveText(itemName);
});

// test("Can open a task page.", async ({ page }) => {
//   await page.goto("/");
//   const taskName = `My task: ${Math.random()}`;
//   await page.locator("input[type=text]").type(taskName);
//   await page.locator("input[type=submit]").click();
//   await page.locator(`a >> text='${taskName}'`).click();
//   await expect(page.locator("h1")).toHaveText(taskName);
// });