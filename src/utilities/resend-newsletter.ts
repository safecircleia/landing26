import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface NewsletterSubscriptionData {
  email: string
  firstName?: string
  lastName?: string
  pageName?: string
  pageUri?: string
  source?: string
}

export interface BlogPostData {
  authorName?: string
  categorySlug?: string
  excerpt?: string
  featuredImageUrl?: string
  publishedOn?: string
  slug: string
  title: string
}

/**
 * Add a contact to the Resend newsletter audience
 */
export async function addToNewsletterAudience(
  data: NewsletterSubscriptionData,
): Promise<{ error?: string; success: boolean }> {
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!audienceId) {
      // eslint-disable-next-line no-console
      console.warn('RESEND_AUDIENCE_ID not configured')
      return { error: 'Audience ID not configured', success: false }
    }

    if (!resend) {
      // eslint-disable-next-line no-console
      console.error('Resend not properly initialized')
      return { error: 'Resend not initialized', success: false }
    }

    // Add contact to audience
    const result = await resend.contacts.create({
      audienceId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      unsubscribed: false,
    })

    if (result.error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add contact to Resend audience:', result.error)
      return { error: result.error.message, success: false }
    }

    // eslint-disable-next-line no-console
    console.log('Successfully added contact to Resend newsletter:', data.email)
    return { success: true }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error adding contact to Resend newsletter:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    }
  }
}

/**
 * Check if an email is already in the newsletter audience
 */
export async function isEmailInAudience(email: string): Promise<boolean> {
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID

    if (!audienceId || !resend) {
      return false
    }

    const result = await resend.contacts.list({
      audienceId,
    })

    if (result.error || !result.data) {
      return false
    }

    // Check if the result.data is an array or has contacts property
    const contacts = Array.isArray(result.data) ? result.data : result.data.data || []
    return contacts.some((contact) => contact.email === email)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error checking if email is in audience:', error)
    return false
  }
}

/**
 * Determine if a form submission should be added to newsletter
 * This checks if the form has an email field and if it's a newsletter-type form
 */
export function shouldAddToNewsletter(formData: { field: string; value: string }[]): {
  email?: string
  firstName?: string
  lastName?: string
  shouldAdd: boolean
} {
  const emailField = formData.find(
    (item) => item.field.toLowerCase().includes('email') || item.field === 'email',
  )

  if (!emailField?.value) {
    return { shouldAdd: false }
  }

  const firstNameField = formData.find(
    (item) =>
      item.field.toLowerCase().includes('firstname') ||
      item.field.toLowerCase().includes('first_name') ||
      item.field === 'firstName' ||
      item.field === 'name',
  )

  const lastNameField = formData.find(
    (item) =>
      item.field.toLowerCase().includes('lastname') ||
      item.field.toLowerCase().includes('last_name') ||
      item.field === 'lastName',
  )

  return {
    email: emailField.value,
    firstName: firstNameField?.value,
    lastName: lastNameField?.value,
    shouldAdd: true,
  }
}

/**
 * Send newsletter email to all subscribers when a new blog post is published
 */
export async function sendNewPostEmail(
  postData: BlogPostData,
): Promise<{ error?: string; success: boolean }> {
  try {
    const audienceId = process.env.RESEND_AUDIENCE_ID
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'news@notify.safecircle.tech'

    if (!audienceId) {
      // eslint-disable-next-line no-console
      console.warn('RESEND_AUDIENCE_ID not configured')
      return { error: 'Audience ID not configured', success: false }
    }

    if (!resend) {
      // eslint-disable-next-line no-console
      console.error('Resend not properly initialized')
      return { error: 'Resend not initialized', success: false }
    }

    // Get the base URL for the site
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://safecircle.tech'
    const postUrl = postData.categorySlug
      ? `${baseUrl}/posts/${postData.categorySlug}/${postData.slug}`
      : `${baseUrl}/posts/${postData.slug}`

    // Create the email content
    const emailHtml = createNewPostEmailTemplate(postData, postUrl)
    const emailText = createNewPostEmailText(postData, postUrl)

    // Step 1: Create the broadcast
    const createResult = await resend.broadcasts.create({
      audienceId,
      from: fromEmail,
      html: emailHtml,
      subject: `New Post: ${postData.title}`,
      text: emailText,
    })

    if (createResult.error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create newsletter broadcast:', createResult.error)
      return { error: createResult.error.message, success: false }
    }

    if (!createResult.data?.id) {
      // eslint-disable-next-line no-console
      console.error('No broadcast ID returned from create')
      return { error: 'No broadcast ID returned', success: false }
    }

    // Step 2: Send the broadcast immediately
    const sendResult = await resend.broadcasts.send(createResult.data.id)

    if (sendResult.error) {
      // eslint-disable-next-line no-console
      console.error('Failed to send newsletter broadcast:', sendResult.error)
      return { error: sendResult.error.message, success: false }
    }

    // eslint-disable-next-line no-console
    console.log(
      `Successfully sent newsletter email for post: ${postData.title} (Broadcast ID: ${createResult.data.id})`,
    )
    return { success: true }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error sending newsletter email:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    }
  }
}

/**
 * Create HTML email template for new blog post
 */
function createNewPostEmailTemplate(postData: BlogPostData, postUrl: string): string {
  const featuredImage = postData.featuredImageUrl
    ? `
      <div style="margin-bottom: 30px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <img src="${postData.featuredImageUrl}" alt="${postData.title}" style="width: 100%; height: auto; display: block;" />
      </div>
    `
    : ''

  const publishedDate = postData.publishedOn
    ? new Date(postData.publishedOn).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Post: ${postData.title}</title>
        <style>
          @media only screen and (max-width: 600px) {
            .container { padding: 20px !important; }
            .title { font-size: 24px !important; }
            .cta-button { padding: 12px 20px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
        <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background-color: #2563eb; padding: 32px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 6px 0;">SafeCircle</h1>
            <p style="color: #bfdbfe; font-size: 14px; margin: 0;">Weekly Update</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px 30px;">
            
            <!-- Greeting -->
            <p style="color: #6b7280; font-size: 16px; margin: 0 0 24px 0;">
              Hey there,
            </p>
            
            ${featuredImage}
            
            <!-- Title -->
            <h2 class="title" style="color: #111827; font-size: 28px; font-weight: 600; margin: 0 0 16px 0; line-height: 1.3;">
              ${postData.title}
            </h2>
            
            <!-- Meta Info -->
            <div style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                ${postData.authorName ? `By ${postData.authorName}` : ''}${publishedDate ? ` • ${publishedDate}` : ''}
              </p>
            </div>
            
            <!-- Excerpt -->
            ${
              postData.excerpt
                ? `
            <div style="background-color: #f9fafb; border-left: 3px solid #2563eb; padding: 20px; margin: 24px 0;">
              <p class="excerpt" style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
                ${postData.excerpt}
              </p>
            </div>
            `
                : ''
            }
            
            <!-- Call to Action -->
            <div style="margin: 32px 0;">
              <a href="${postUrl}" class="cta-button" style="
                background-color: #2563eb;
                color: #ffffff;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 6px;
                display: inline-block;
                font-weight: 500;
                font-size: 16px;
              ">
                Read the full post
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 15px; margin: 20px 0 0 0; line-height: 1.5;">
              Thanks for reading, and feel free to reply if you have any thoughts or questions.
            </p>
            
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 24px 30px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 13px; margin: 0 0 12px 0; text-align: center; line-height: 1.5;">
              You're getting this because you signed up for SafeCircle updates. We only send these when we have something worth sharing.
            </p>
            <div style="text-align: center; margin-top: 16px;">
              <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #6b7280; text-decoration: underline; font-size: 12px;">
                Unsubscribe
              </a>
            </div>
            <div style="margin-top: 12px; text-align: center;">
              <p style="color: #9ca3af; font-size: 11px; margin: 0;">
                SafeCircle
              </p>
            </div>
          </div>
          
        </div>
        
      </body>
    </html>
  `
}

/**
 * Create plain text email template for new blog post
 */
function createNewPostEmailText(postData: BlogPostData, postUrl: string): string {
  const publishedDate = postData.publishedOn
    ? new Date(postData.publishedOn).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  const excerptSection = postData.excerpt
    ? `

${postData.excerpt}

`
    : ''

  return `
Hey there,

${postData.title}

${postData.authorName ? `By ${postData.authorName}` : ''}${publishedDate ? ` • ${publishedDate}` : ''}
${excerptSection}
Read the full post: ${postUrl}

Thanks for reading, and feel free to reply if you have any thoughts or questions.

---

You're getting this because you signed up for SafeCircle updates. We only send these when we have something worth sharing.

Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}
  `.trim()
}
