# Superbloom Academy: launch checklist

Written on 2026-10-07. Work through it top to bottom. Part 1 must be finished before the new site goes live; Parts 3 to 5 are done after it is live.

## Part 1. Before you deploy

### 1.1 Change the passwords that were published (urgent)

The GitHub repository is public, and `backend/.env` was committed to it. Anyone can read these values in the repository history:

| Value | Where to change it |
|---|---|
| `MONGO_URI` (database password) | MongoDB Atlas > Database Access > edit the user > change password |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | Generate two new ones: run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` twice |
| `CLOUD_API_SECRET` | Cloudinary > Settings > API Keys > generate a new secret |

After changing each one:

1. Put the new value in the Vercel backend project (Settings > Environment Variables) and redeploy the backend.
2. Put the new value in your local `backend/.env`.
3. Everyone logged in to the admin panel will be logged out once. That is expected.

The `.env` files are no longer tracked by git and `.gitignore` now blocks them, but that does not remove the old values from history. Changing them is the fix. Also consider making the repository private (GitHub > Settings > General > Change visibility).

### 1.2 Switch on workshop emails (Gmail)

Emails go out from `superbloomacademy@gmail.com`, which is also the contact address shown on the website. The code is ready. Two emails are sent automatically:

| When | Email the student gets |
|---|---|
| A student registers for a paid workshop | "Registration received" with the reference code, the workshop details, the UPI reference and a link to check status |
| An admin clicks Verify on the payment | "Seat confirmed" with the same details |
| A student registers for a free workshop | "Seat confirmed" straight away |

Nothing is sent until the app password is added. Until then registrations work exactly as before.

1. Sign in to `superbloomacademy@gmail.com` and open myaccount.google.com > Security.
2. Turn on **2-Step Verification** if it is off. App passwords do not exist without it.
3. Open myaccount.google.com/apppasswords, name it "Superbloom website" and click Create. Google shows a 16-letter password once. Copy it.
4. In the Vercel backend project add these variables, then redeploy:

| Variable | Value |
|---|---|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `superbloomacademy@gmail.com` |
| `SMTP_PASS` | the 16-letter app password, without spaces |
| `MAIL_FROM` | `Superbloom Academy <superbloomacademy@gmail.com>` |
| `SITE_URL` | `https://www.superbloomacademy.in` |

5. For local testing, paste the same app password after `SMTP_PASS=` in `backend/.env` (the other lines are already there) and restart the backend.
6. Test it: publish a test workshop, register with a different email address of your own, then verify the payment in the admin panel. You should get both emails. The admin panel tells you each time whether the confirmation email went out.

Good to know:

- Gmail allows about 500 emails a day from one account. That is plenty for workshops.
- Students who reply reach the Gmail inbox directly.
- Sent emails appear in the Gmail Sent folder, which is a useful record.
- Never share the app password or put it in a file that goes to GitHub. If it leaks, delete it on the app passwords page and create a new one.

### 1.3 Later: an address on your own domain

`superbloomacademy.in` has no mail (MX) records, so an address like `contact@superbloomacademy.in` cannot receive email today. Gmail is fine for now. When you want a domain address:

- Create the mailbox with a mail service (Hostinger Email, Google Workspace or Zoho Mail; your DNS is already at Hostinger) and add the MX records it gives you.
- Change `email` in `frontend/src/lib/site.js` and the `SMTP_*` and `MAIL_FROM` variables to the new address.

### 1.4 Check the Vercel settings

| Project | Variable | Should be |
|---|---|---|
| frontend | `API_BASE` | the backend URL |
| frontend | `NEXT_PUBLIC_GA_ID` | `G-K231SSXR6C` |
| backend | `CLIENT_URL` | `https://www.superbloomacademy.in` |
| backend | `ADMIN_URL` | `https://admin.superbloomacademy.in` |
| admin | `VITE_API_BASE` | the backend URL |

Each Vercel project must have its Root Directory set to its folder (`frontend`, `admin`, `backend`). Full detail is in `VERCEL-DEPLOYMENT-GUIDE.md`.

### 1.5 Content still to supply

- Abdul Hameed's photo for the About page (white background, like the existing portrait). Save it in `frontend/public/images/team/` and add `photo: "/images/team/<file>.jpg"` to his entry in `frontend/src/app/about/page.js`.
- Read the About page once and confirm the wording, especially the six reasons and the "degree versus first job" panel.
- The workshop clip on the About page is silent because the Instagram version uses a licensed song. If you have the original recording, replace `frontend/public/videos/ui-ux-workshop.mp4`.
- Write workshop summaries in the admin panel as one or two full sentences (about 120 to 155 characters). Google shows this text under the workshop in search results.

## Part 2. Deploy and check

1. Commit the work and push it to `main`. Vercel builds the three projects automatically.
2. When the builds finish, open each of these on the live site:

| Check | Expected |
|---|---|
| `https://www.superbloomacademy.in/about` | New page, photos load, the video plays on the page |
| `https://www.superbloomacademy.in/why-superbloom` | Sends you to `/about` |
| `https://www.superbloomacademy.in/sitemap.xml` | Lists the pages; `/why-superbloom` is not in it |
| `https://www.superbloomacademy.in/robots.txt` | Shows `Allow: /` and the sitemap line |
| A programme page and a workshop page | Load normally |
| Admission, contact and college forms | Each submission appears in the admin panel |
| Admin login at `admin.superbloomacademy.in` | Works with the new secrets |
| Paste the home page link into WhatsApp | The preview shows the banner with the logo and classroom photo |

## Part 3. Google set-up, in the first week

### 3.1 Google Search Console

1. Go to search.google.com/search-console and add a **Domain** property for `superbloomacademy.in`.
2. Google gives you a TXT record. Add it in Hostinger DNS and click Verify.
3. Sitemaps > enter `https://www.superbloomacademy.in/sitemap.xml` > Submit.
4. URL Inspection > paste each of these and click Request Indexing: the home page, `/programs`, `/programs/engineering`, `/programs/pharmacy`, `/for-colleges`, `/about`, `/workshops`.
5. After one week open Pages (Indexing) and check that the count of indexed pages is growing. `/why-superbloom` will show as "Page with redirect"; that is correct.

### 3.2 Google Analytics

The tag `G-K231SSXR6C` is already on every page. In analytics.google.com:

1. Reports > Realtime: open the live site in another tab and confirm you appear.
2. Admin > Events: mark these as key events once they have fired at least once: `generate_lead` (admission and college enquiry), `sign_up` (workshop registration), `contact` (contact form), `contact_click` (call and WhatsApp buttons).
3. Admin > Product links > Search Console links: link the property from 3.1.
4. Admin > Data streams > your stream > Configure tag settings > Define internal traffic: add your office IP so your own visits are not counted.

### 3.3 Google Business Profile

This is what puts you on Google Maps and in "near me" results. Go to business.google.com.

| Field | Enter |
|---|---|
| Name | Superbloom Academy |
| Category | Training centre (add Educational institution as a second category) |
| Address | H. No: 2-101/A, Ground Floor, Opp. Mana Hospital, Beside Sub-Registration Office, Venkatrama Colony, Suraram, Hyderabad, Telangana 500055 |
| Phone | +91 91210 90091 |
| Website | https://www.superbloomacademy.in |
| Hours | Monday to Friday 9:00 AM to 6:00 PM, Saturday 9:00 AM to 2:00 PM, Sunday closed |
| Services | One per programme, using the programme names on the site |
| Photos | The campus session photos, the centre from outside, the classroom |

- The name, address, phone and hours must match the website exactly. Google compares them.
- Verification is usually by a short video or a postcard; follow what Google offers.
- After each batch or workshop, send students the review link (Profile > Ask for reviews) and reply to every review.
- Post each new workshop as an Update with a link to its page.
- When the profile is live, add its link to the `social` list in `frontend/src/lib/site.js` so it is included in the site's organisation data.

### 3.4 Smaller tasks

- Bing Webmaster Tools (bing.com/webmasters): choose "Import from Google Search Console". Two minutes.
- Instagram: set the bio link to `https://www.superbloomacademy.in`.
- Create a LinkedIn company page and link the website. Add its URL to the `social` list in `site.js`.
- Test structured data at search.google.com/test/rich-results with the home page, one programme page and one workshop page.
- Test speed at pagespeed.web.dev with the home page and `/about` on mobile.

## Part 4. Keywords

Each page targets one phrase. The full map, with titles and descriptions, is in `SEO-KEYWORDS-AND-CONTENT.md`. The ones to watch first in Search Console:

| Group | Keywords | Page |
|---|---|---|
| Brand | Superbloom Academy, Superbloom Academy Hyderabad, why choose Superbloom Academy | Home, About, Contact |
| Core | industry-oriented training Hyderabad, job-oriented training programs, skill development programs for college students | Home, Programs |
| Engineering | engineering training programs Hyderabad, MERN full stack course Hyderabad, Python full stack course Hyderabad, Java and DSA course Hyderabad, data analytics course Hyderabad, UI/UX design course Hyderabad, DevOps training Hyderabad | Engineering hub and programme pages |
| Pharmacy | pharmacy training programs Hyderabad, courses after B.Pharm, medical coding course Hyderabad, pharmacovigilance training Hyderabad, clinical research course Hyderabad, regulatory affairs course Hyderabad | Pharmacy hub and programme pages |
| Colleges | campus training programs for colleges, industry training for colleges, skill development programs for engineering colleges | For colleges |
| Workshops | student workshops Hyderabad, plus the topic of each workshop | Workshops |
| Guides | career options after B.Pharmacy, medical coding vs pharmacovigilance, skills CSE students should learn | Resources |

How to use them after launch:

1. **Do not add pages for phrases that already have one.** Two pages competing for one phrase weakens both.
2. **Publish two guides a month** from the admin panel (Articles). The 16 topics to write are listed in `SEO-KEYWORDS-AND-CONTENT.md` under "Keywords from the research that have no page yet". Link each guide to its programme page.
3. **After four weeks, open Search Console > Performance > Queries.** For any query where you rank between positions 5 and 20, strengthen the matching page: add a section that answers the query directly.
4. **Put the keyword in the workshop title** when you create one, for example "UI/UX Design Workshop for Engineering Students" rather than "Design Day".
5. **Use the same wording off the site**: Google Business Profile services, Instagram bio and LinkedIn page should name the programmes exactly as the site does.

## Part 5. What was audited, and what is still open

All 34 pages in the sitemap were crawled on 2026-10-07:

| Check | Result |
|---|---|
| Unique title of 60 characters or fewer | All pages pass |
| Description of 160 characters or fewer | All pages pass |
| Exactly one main heading (H1) | All pages pass |
| Canonical URL | All pages pass |
| Share image | All pages pass; now a 1200 by 630 banner |
| Images with alt text | All images pass |
| Structured data valid | All pages pass |
| Broken internal links | None |
| Status and ad landing pages kept out of search | Yes (`noindex`) |

Fixed during the audit:

- Share image changed from the square logo to a 1200 by 630 banner (`/og.jpg`), and the social card enlarged to match.
- Instagram profile added to the organisation data.
- Workshop pages with a very short summary now add the date and venue to the description.
- `/why-superbloom` merged into `/about` with a permanent redirect; removed from the sitemap and footer.
- Images renamed with descriptive file names and moved into `public/images/` and `public/videos/`. The logo, emblem and icon files are 66 to 73 percent smaller.

Still open:

- `/workshops`, `/resources` and `/careers` have little text. They fill out as workshops, guides and jobs are published.
- Programme pages have no fees, batch dates, trainer names or student outcomes yet. These are the strongest things you can add.
- No reviews or testimonials on the site. Add them once the Google Business Profile has some.
- The About page shows one contributor photo and one placeholder.

## Monthly routine

| When | Task |
|---|---|
| Weekly | Check new leads and registrations in the admin panel; reply to Google reviews |
| Twice a month | Publish one guide; post one Google Business Profile update |
| Monthly | Search Console: check Pages for errors and Performance for rising queries. Analytics: compare key events with last month |
| Each workshop | Create it in the admin panel with a full summary, share the link on Instagram and WhatsApp, post it on the Business Profile |
