import { test, expect } from "@playwright/test"


const UI_URL = "http://localhost:5173/"


test.beforeEach(async ({ page }) => {
    await page.goto(UI_URL);

    // get sign-in button
    await page.getByRole("link", { name: "Sign In" }).click()

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible()

    await page.locator("[name=email]").fill("1@1.com")
    await page.locator("[name=password]").fill("password123")

    await page.getByRole("button", { name: "Login" }).click()

    await expect(page.getByText("Sign In Successful!")).toBeVisible()
    await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible()
    await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible()
    await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible()
})


test("should display hotels", async ({ page }) => {
    await page.goto(`${UI_URL}my-hotels`)

    await expect(page.getByText("Dublin Getaways")).toBeVisible()

    await expect(page.getByText("Lorem ipsum dolor sit amet")).toBeVisible()
    await expect(page.getByText("All Inclusive")).toBeVisible()
    await expect(page.getByText("EUR119 per night")).toBeVisible()
    await expect(page.getByText("2 adults, 3 children")).toBeVisible()

    // View Details test only works for one, not several, hotel in db it seems like
    await expect(page.getByRole("link", { name: "View Details" }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible()

})

test("should edit hotel", async ({ page }) => {
    await page.goto(`${UI_URL}my-hotels`)

    await page.getByRole("link", { name: "View Details" }).first().click()

    await page.waitForSelector("[name='name']", { state: "attached" })
    await expect(page.locator("[name='name']")).toHaveValue("Dublin Getaways")
    await page.locator("[name='name']").fill("Dublin Getaways UPDATED")
    await page.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("Hotel Saved!")).toBeVisible()

    await page.reload()

    await expect(page.locator("[name='name']")).toHaveValue("Dublin Getaways UPDATED")
    await page.locator("[name='name']").fill("Dublin Getaways")

    await page.getByRole("button", { name: "Save" }).click()
})

test("Should show hotel search results", async ({ page }) => {
    await page.goto(UI_URL)

    await page.getByPlaceholder("Where are you going?").fill("Dublin")
    await page.getByRole("button", { name: "Search" }).click()

    await expect(page.getByText("Hotels found in Dublin")).toBeVisible()
    await expect(page.getByText("Dublin Getaways")).toBeVisible()
})

test("Should show hotel detail", async ({ page }) => {
    await page.getByPlaceholder("Where are you going?").fill("Dublin")
    await page.getByRole("button", { name: "Search" }).click()

    await page.getByText("Dublin Getaways").click()
    await expect(page).toHaveURL(/detail/);
    await expect(page.getByRole("button", { name: "Book now" })).toBeVisible()
})

test("Should book hotel", async ({ page }) => {
    await page.getByPlaceholder("Where are you going?").fill("Dublin")

    const date = new Date()
    date.setDate(date.getDate() + 3)
    const formattedDate = date.toISOString().split("T")[0]

    await page.getByPlaceholder("check-out Date").fill(formattedDate)

    await page.getByRole("button", { name: "Search" }).click()

    await page.getByText("Dublin Getaways").click()
    await page.getByRole("button", { name: "Book now" }).click()

    await expect(page.getByText("Total Cost: EUR357.00")).toBeVisible()

    const stripeFrame = page.frameLocator("iframe").first()
    await stripeFrame.locator("[placeholder='Card number']").fill("4242424242424242")
    await stripeFrame.locator("[placeholder='MM / YY']").fill("04/30")
    await stripeFrame.locator("[placeholder='CVC']").fill("242")
    await stripeFrame.locator("[placeholder='ZIP']").fill("24225")

    await page.getByRole("button", {name: "Confirm Booking"}).click()
    await expect(page.getByText("Booking Saved!")).toBeVisible()

    await page.getByRole("link", {name: "My Bookings"}).click()
    await expect(page.getByText("Dublin Getaways")).toBeVisible()
})