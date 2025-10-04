import type { CollectionConfig } from 'payload'

import { isAdmin } from '@root/access/isAdmin'
import { revalidatePath, revalidateTag } from 'next/cache'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Name',
          localized: true,
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Slug',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'headline',
      type: 'text',
      label: 'Headline',
      localized: true,
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      localized: true,
      required: true,
    },
    {
      name: 'posts',
      type: 'join',
      collection: 'posts',
      defaultLimit: 0,
      label: 'Posts',
      maxDepth: 2,
      on: 'category',
    },
  ],
  forceSelect: {
    name: true,
    slug: true,
  },
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        revalidatePath(`/posts/${doc.slug}`)
        revalidateTag('archives')
        revalidateTag(`${doc.slug}-archive-en`)
        revalidateTag(`${doc.slug}-archive-es`)
        revalidateTag(`${doc.slug}-archive-fr`)

        if (doc.slug !== previousDoc?.slug && previousDoc?.slug) {
          revalidatePath(`/posts/${previousDoc.slug}`)
          revalidateTag(`${previousDoc.slug}-archive-en`)
          revalidateTag(`${previousDoc.slug}-archive-es`)
          revalidateTag(`${previousDoc.slug}-archive-fr`)
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidatePath(`/posts/${doc.slug}`)
        revalidateTag('archives')
        revalidateTag(`${doc.slug}-archive-en`)
        revalidateTag(`${doc.slug}-archive-es`)
        revalidateTag(`${doc.slug}-archive-fr`)
      },
    ],
  },
}
