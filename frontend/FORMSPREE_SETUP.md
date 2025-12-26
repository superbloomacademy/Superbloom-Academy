# Formspree Setup Guide

This guide will help you connect your forms to Formspree for data storage and email notifications.

## Step 1: Create Formspree Account

1. Go to [https://formspree.io](https://formspree.io)
2. Sign up for a free account (or log in if you already have one)

## Step 2: Create Forms

1. **Application Form:**
   - Go to your Formspree dashboard
   - Click "New Form"
   - Name it "Application Form" or "Superbloom Applications"
   - Copy the Form ID (it looks like: `xvgkqyzw` or `abc123def`)

2. **Contact Form:**
   - Create another form
   - Name it "Contact Form" or "Superbloom Contact"
   - Copy the Form ID

## Step 3: Configure Environment Variables

1. Create a `.env` file in the `frontend` directory (if it doesn't exist)
2. Add your Formspree form IDs:

```env
REACT_APP_FORMSPREE_APPLICATION_ID=your_application_form_id_here
REACT_APP_FORMSPREE_CONTACT_ID=your_contact_form_id_here
```

**Example:**
```env
REACT_APP_FORMSPREE_APPLICATION_ID=xvgkqyzw
REACT_APP_FORMSPREE_CONTACT_ID=abc123def
```

## Step 4: Restart Development Server

After adding the environment variables:

1. Stop your development server (Ctrl+C)
2. Start it again: `npm start`

**Important:** Environment variables are only loaded when the server starts, so you must restart after adding/changing them.

## Step 5: Test Your Forms

1. Fill out the Application form and submit
2. Fill out the Contact form and submit
3. Check your Formspree dashboard - you should see the submissions
4. Check your email (if you configured email notifications in Formspree)

## How It Works

- **Application Form:** Submits to `https://formspree.io/f/{REACT_APP_FORMSPREE_APPLICATION_ID}`
- **Contact Form:** Submits to `https://formspree.io/f/{REACT_APP_FORMSPREE_CONTACT_ID}`

All form data is stored in your Formspree account and can be:
- Viewed in the dashboard
- Exported as CSV
- Forwarded to your email
- Integrated with other services (Zapier, etc.)

## Troubleshooting

### Forms not submitting?
- Check that your `.env` file is in the `frontend` directory
- Verify the form IDs are correct (no extra spaces)
- Make sure you restarted the dev server after adding environment variables
- Check the browser console for error messages

### Getting 404 errors?
- Verify your Formspree form IDs are correct
- Make sure the forms are active in your Formspree dashboard

### Need help?
- Visit [Formspree Documentation](https://help.formspree.io/)
- Check the browser console for detailed error messages

