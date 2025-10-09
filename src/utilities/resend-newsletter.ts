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
