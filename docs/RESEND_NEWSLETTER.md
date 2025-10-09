# Resend Newsletter Integration

This document explains how to set up and configure the Resend newsletter integration for automatic newsletter subscriptions when users fill out forms.

**Note:** This implementation replaces HubSpot integration and uses only Resend for newsletter management.

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Resend API Key - Get this from your Resend dashboard
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

# Resend Audience ID - The ID of your newsletter audience in Resend
RESEND_AUDIENCE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# From Email Address - The email address that newsletter emails will be sent from
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 2. Resend Dashboard Setup

1. **Create a Resend Account**: Go to [resend.com](https://resend.com) and create an account
2. **Get API Key**: 
   - Navigate to Settings > API Keys
   - Create a new API key with "Full access" permissions
   - Copy the API key and add it to your environment variables

3. **Create an Audience**:
   - Go to Audiences in your Resend dashboard
   - Click "Create Audience"
   - Give it a name (e.g., "Newsletter Subscribers")
   - Copy the Audience ID and add it to your environment variables

4. **Configure From Email** (Optional):
   - Add a `RESEND_FROM_EMAIL` environment variable with the email address you want to send from
   - If not set, the system will default to `noreply@safecircle.com`
   - Make sure the domain is verified in your Resend account

### 3. How It Works

The integration automatically:

1. **Detects Email Forms**: When any form is submitted with an email field, the system checks if it should be added to the newsletter
2. **Extracts User Data**: Automatically extracts email, first name, and last name from form submissions
3. **Adds to Audience**: Adds the contact to your Resend newsletter audience
4. **Handles Duplicates**: Resend automatically handles duplicate contacts
5. **Logs Activity**: All newsletter activity is logged through Payload's logger
6. **New Post Notifications**: Automatically sends email notifications to all subscribers when a new blog post is published

### 4. Supported Form Fields

The system automatically detects and maps the following field names:

**Email Fields:**
- `email`
- Any field containing "email" in the name

**First Name Fields:**
- `firstName`
- `first_name`
- `name` (when no firstName field exists)
- Any field containing "firstname"

**Last Name Fields:**
- `lastName`
- `last_name`
- Any field containing "lastname"

### 5. Form Configuration

No special configuration is required. Any form that includes an email field will automatically trigger newsletter subscription. This includes:

- Contact forms
- Newsletter signup forms
- Registration forms
- Any custom forms with email fields

### 6. Monitoring

You can monitor newsletter subscriptions through:

- **Payload Admin**: Check the form submission logs
- **Resend Dashboard**: View your audience growth and contact details
- **Server Logs**: Newsletter activity is logged with info level

### 7. Error Handling

The integration includes comprehensive error handling:

- If Resend API is unavailable, form submissions still work normally
- Missing environment variables are logged as warnings
- API errors are logged but don't break the form submission process
- All operations are performed asynchronously to not impact form submission speed

### 8. Testing

To test the integration:

1. Ensure environment variables are set correctly
2. Submit a form with an email field
3. Check the Payload logs for success/error messages
4. Verify the contact appears in your Resend audience

Example log messages:
```
INFO: Successfully added user@example.com to newsletter
WARN: Failed to add user@example.com to newsletter: API key not configured
```

### 9. New Blog Post Email Notifications

The system automatically sends email notifications to all newsletter subscribers when a new blog post is published. This happens when:

- A new post is created with status "published"
- An existing draft post is changed to "published" status

The email includes:
- **Modern Design**: Beautiful gradient header and responsive layout
- **Post title and excerpt**: Prominently displayed with enhanced typography
- **Author name(s)**: With emoji icons and proper styling
- **Featured image**: Rounded corners and shadow effects (if available)
- **Publication date**: Nicely formatted with calendar emoji
- **Call-to-Action**: Eye-catching gradient button with hover effects
- **Personalization**: Uses subscriber's first name with fallback
- **Professional footer**: Complete with branding and unsubscribe option
- **Mobile responsive**: Optimized for all screen sizes

The system automatically handles:
- Extracting plain text from rich text excerpts
- Building correct post URLs with category slugs
- Fetching author information (both team members and guest authors)
- Getting featured image URLs
- Error handling and logging

## API Reference

### `addToNewsletterAudience(data)`

Adds a contact to the Resend newsletter audience.

**Parameters:**
- `data.email` (string, required): Contact's email address
- `data.firstName` (string, optional): Contact's first name
- `data.lastName` (string, optional): Contact's last name
- `data.source` (string, optional): Source of the subscription
- `data.pageName` (string, optional): Page where form was submitted
- `data.pageUri` (string, optional): Full URL where form was submitted

**Returns:**
```typescript
Promise<{ error?: string; success: boolean }>
```

### `sendNewPostEmail(postData)`

Sends a newsletter email to all subscribers when a new blog post is published.

**Parameters:**
- `postData.title` (string, required): Blog post title
- `postData.slug` (string, required): Blog post slug for URL generation
- `postData.excerpt` (string, optional): Blog post excerpt/summary
- `postData.categorySlug` (string, optional): Category slug for URL generation
- `postData.authorName` (string, optional): Author name(s)
- `postData.publishedOn` (string, optional): Publication date
- `postData.featuredImageUrl` (string, optional): Featured image URL

**Returns:**
```typescript
Promise<{ error?: string; success: boolean }>
```

### `shouldAddToNewsletter(formData)`

Determines if a form submission should be added to the newsletter based on form fields.

**Parameters:**
- `formData` (array): Array of form field objects with `field` and `value` properties

**Returns:**
```typescript
{
  email?: string;
  firstName?: string;
  lastName?: string;
  shouldAdd: boolean;
}
```

## Troubleshooting

### Common Issues

1. **Contacts not being added**:
   - Check that `RESEND_API_KEY` is set correctly
   - Verify `RESEND_AUDIENCE_ID` matches your audience in Resend
   - Check server logs for error messages

2. **API Key errors**:
   - Ensure the API key has "Full access" permissions
   - Verify the API key is not expired

3. **Audience ID errors**:
   - Copy the audience ID exactly from your Resend dashboard
   - Ensure the audience exists and is active

### Debug Mode

To enable detailed logging, check your Payload logs when forms are submitted. The integration logs all activities with appropriate log levels.