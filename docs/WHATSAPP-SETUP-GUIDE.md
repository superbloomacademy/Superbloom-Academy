# WhatsApp setup guide

Campaigns (admin panel, Workshops, Campaigns) send by email and WhatsApp. Email uses the Gmail settings that workshop emails already use. WhatsApp needs the one-time setup below.

WhatsApp messages go through Meta's official **WhatsApp Business Cloud API**. They are sent by the server from a business number. No personal WhatsApp account is used, and no phone has to stay online.

You do not need the WhatsApp Business app or an existing business account. A Facebook login is enough to start.

## What it costs

- The API and the test number are free.
- Meta charges for each message delivered from a real number. In India a promotional (marketing) message costs roughly ₹0.80 to ₹0.90 and a utility message far less. Check Meta's current rate card before a large send.
- Email costs nothing. A Gmail account sends about 500 emails a day.

## Step 1: try it with Meta's free test number

This needs no phone number of your own and takes about 15 minutes.

1. Open https://developers.facebook.com, log in with Facebook and choose **My Apps, Create App**.
2. Pick the use case that connects to WhatsApp (shown as "Connect with customers through WhatsApp"), and let it create a business portfolio for Superbloom Academy if you have none.
3. In the app, open **WhatsApp, API Setup**. Meta gives you a test number. Note three values from this page:
   - **Temporary access token** (works for 24 hours)
   - **Phone number ID**
   - **WhatsApp Business Account ID**
4. Under **To**, add your own mobile number and confirm the code WhatsApp sends you. A test number can message only the numbers added here (five at most).
5. Put the values in `backend/.env` for local work, or in Vercel (backend project, Settings, Environment Variables) and redeploy:

   ```
   WHATSAPP_TOKEN=<access token>
   WHATSAPP_PHONE_ID=<phone number ID>
   WHATSAPP_BUSINESS_ID=<WhatsApp Business Account ID>
   ```

6. In the admin panel open **Campaigns**. "Sending channels" should show WhatsApp as **Connected**.

## Step 2: create the message templates

WhatsApp only lets a business start a conversation with a message Meta has approved, called a template. The wording is fixed; the parts in `{{ }}` change per student.

Create them at https://business.facebook.com/wa/manage/message-templates (**Create template**). Approval usually takes minutes, sometimes a few hours. Approved templates then appear in the campaign form.

### workshop_invite

- Category: Marketing. Language: English.
- Body:

  ```
  Hi {{1}}, thank you for joining our earlier workshop at Superbloom Academy.

  Our next workshop, {{2}}, is on {{3}}. Seats are limited.

  Tap the button below to see the details and register.
  ```

- Sample values when asked: `Ravi`, `UI/UX Design Workshop`, `Sunday, 15 November 2026`.
- Footer: `Reply STOP to stop these messages`
- Buttons:
  - Visit website, text `Register now`, URL type **Dynamic**, `https://www.superbloomacademy.in/workshops/{{1}}`, sample `ui-ux-design-workshop`
  - Marketing opt-out (adds a "Stop promotions" button)

In the campaign form, choose the workshop the message is about. The values fill themselves: `{name}`, `{workshop}`, `{date}`, and `{slug}` for the button.

### course_offer

- Category: Marketing. Language: English.
- Body:

  ```
  Hi {{1}}, as a Superbloom Academy workshop student you can join {{2}} at a special fee of {{3}}.

  The offer is open until {{4}}. Tap the button below to know more.
  ```

- Footer: `Reply STOP to stop these messages`
- Buttons: Visit website, text `View the course`, URL type Static, `https://www.superbloomacademy.in/programs`; and Marketing opt-out.

In the campaign form, keep `{name}` for the first value and type the course name, the fee and the last date for the others.

### workshop_feedback

- Category: Utility (Meta may move it to Marketing; that is fine). Language: English.
- Body:

  ```
  Hi {{1}}, thank you for attending {{2}} at Superbloom Academy.

  Could you take two minutes to tell us how it went? Your feedback helps us improve the next workshop.
  ```

- Buttons: Visit website, text `Give feedback`, URL type Static, the link of your Google Form.

A header picture is optional on any template. If you add one, the campaign form asks for a public `https://` link to the picture.

## Step 3: send a test campaign

1. **Campaigns, New campaign**. Pick the kind, name it, tick WhatsApp and choose the template.
2. Under "Who gets it", paste your own name and number.
3. Save, then use **Send a test to me**, then **Send**.

## Step 4: move to a real number

The test number cannot message students. For that you add the academy's own number.

A number can be on the WhatsApp app or on the API, not both. Since every number you have is on WhatsApp, choose one of these:

- **A new SIM (recommended).** Any new prepaid number works. It only has to receive one code by SMS or call. Your existing WhatsApp accounts are not touched.
- **An existing number you can give up on WhatsApp.** First delete its WhatsApp account on the phone (WhatsApp, Settings, Account, Delete account). Its chats on that number are lost. Then add it below.
- **A landline.** It can receive the code by voice call.

Then:

1. **WhatsApp, API Setup, Add phone number**. Enter the display name (Superbloom Academy), the number, and the code you receive.
2. Replace `WHATSAPP_PHONE_ID` with the new number's ID.
3. Add a payment method: Meta Business settings, **Billing and payments**.
4. Create a token that does not expire: Business settings, **Users, System users, Add** (role Admin). **Assign assets**: the app and the WhatsApp account, full control. **Generate token** with `whatsapp_business_messaging` and `whatsapp_business_management`, expiry Never. Put it in `WHATSAPP_TOKEN`.
5. Redeploy the backend and press **Check again** on the Campaigns page.

### Sending limits

A new number can message about 250 different people in 24 hours. Verify the business (Business settings, Security centre) to raise the limit to 1,000 and then higher as Meta sees good quality. For a larger list before that, send over several days: a campaign can be paused and continued, and no one is messaged twice.

## Step 5: delivery reports and replies (webhook)

Without this step messages still send, but the admin panel cannot show Delivered and Read, and you cannot see what students write back.

1. Make up a long random text and set it as `WHATSAPP_VERIFY_TOKEN`. Copy the **App secret** (app, Settings, Basic) into `WHATSAPP_APP_SECRET`. Redeploy the backend.
2. In the app: **WhatsApp, Configuration, Webhook, Edit**.
   - Callback URL: `https://<backend address>/api/whatsapp/webhook` (the backend's Vercel address, for example `https://superbloom-academy-opal.vercel.app/api/whatsapp/webhook`)
   - Verify token: the same text as `WHATSAPP_VERIFY_TOKEN`
3. Under **Webhook fields**, subscribe to **messages**.
4. Publish the app (switch it from Development to Live) so reports for real students arrive.

Replies from students appear on the Campaigns page under "Replies on WhatsApp". The business number has no phone app, so answer them from the academy's usual WhatsApp with the Reply button.

## Rules that keep the number safe

- Message only students who gave you their number themselves, such as workshop registrations.
- Keep the opt-out button and footer. A student who taps "Stop promotions" or replies STOP is skipped in every later campaign. The same goes for the "Stop these emails" link in emails.
- Do not send the same promotion again and again. When many people block or report a number, Meta lowers its limit and can ban it.
- Do not use tools that automate WhatsApp Web with a normal account. Meta bans numbers for it.

## When something fails

Open the campaign: each student's row shows the reason in plain words. Common ones:

| Message | What to do |
|---|---|
| The access token has expired | The 24-hour test token ran out. Create the permanent token (step 4). |
| Not on the allowed list of the test number | Add the number under **To** in API Setup, or move to a real number. |
| The template does not exist in this language or is not approved | Wait for approval, or check the template's language. |
| Not delivered. The number is probably not on WhatsApp | Nothing to fix. Email still reaches the student. |
| WhatsApp chose not to deliver this | Meta limits how many promotions one person gets. Try again after a day. |
