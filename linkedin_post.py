#!/usr/bin/env python3
"""
Usage:
  python3 linkedin_post.py "Your post content here"
"""
import sys, time
from playwright.sync_api import sync_playwright

EMAIL    = "nefgtz@hotmail.com"
PASSWORD = "dimimaxi"

def post_to_linkedin(content: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = context.new_page()

        print("Navigating to LinkedIn...")
        page.goto("https://www.linkedin.com/login", wait_until="networkidle")
        time.sleep(2)

        print("Logging in...")
        page.fill('input[id="username"]', EMAIL)
        page.fill('input[id="password"]', PASSWORD)
        page.click('button[type="submit"]')
        page.wait_for_load_state("networkidle")
        time.sleep(3)

        if "checkpoint" in page.url or "challenge" in page.url:
            print("ERROR: LinkedIn security checkpoint triggered. Manual login required.")
            browser.close()
            return False

        print("Opening post composer...")
        page.goto("https://www.linkedin.com/feed/", wait_until="networkidle")
        time.sleep(2)

        # Click "Start a post" button
        post_btn = page.locator('button:has-text("Start a post"), button:has-text("Create a post")').first
        post_btn.click()
        time.sleep(2)

        # Type content into the editor
        editor = page.locator('.ql-editor, [role="textbox"], [contenteditable="true"]').first
        editor.click()
        editor.type(content, delay=30)
        time.sleep(1)

        # Click Post button
        submit_btn = page.locator('button:has-text("Post")').last
        submit_btn.click()
        page.wait_for_load_state("networkidle")
        time.sleep(3)

        print(f"SUCCESS: Post published on LinkedIn")
        browser.close()
        return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 linkedin_post.py \"Your post content\"")
        sys.exit(1)

    content = sys.argv[1]
    print(f"Posting to LinkedIn ({len(content)} chars)...")
    success = post_to_linkedin(content)
    sys.exit(0 if success else 1)
