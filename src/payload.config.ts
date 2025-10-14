import { revalidateRedirects } from '@hooks/revalidateRedirects'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import {
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
  LinkFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import link from '@root/fields/link'
import { LabelFeature } from '@root/fields/richText/features/label/server'
import { LargeBodyFeature } from '@root/fields/richText/features/largeBody/server'
import { revalidateTag } from 'next/cache'
import path from 'path'
import { buildConfig, type TextField } from 'payload'
import { fileURLToPath } from 'url'

import { BlogContent } from './blocks/BlogContent'
import { BlogMarkdown } from './blocks/BlogMarkdown'
import { Callout } from './blocks/Callout'
import { CallToAction } from './blocks/CallToAction'
import { CardGrid } from './blocks/CardGrid'
import { CaseStudiesHighlight } from './blocks/CaseStudiesHighlight'
import { CaseStudyCards } from './blocks/CaseStudyCards'
import { CaseStudyParallax } from './blocks/CaseStudyParallax'
import { Code } from './blocks/Code'
import { CodeFeature } from './blocks/CodeFeature'
import { ComparisonTable } from './blocks/ComparisonTable'
import { Content } from './blocks/Content'
import { ContentGrid } from './blocks/ContentGrid'
import { DownloadBlock } from './blocks/Download'
import { CodeExampleBlock, ExampleTabs, MediaExampleBlock } from './blocks/ExampleTabs'
import { Form } from './blocks/Form'
import { HoverCards } from './blocks/HoverCards'
import { HoverHighlights } from './blocks/HoverHighlights'
import { LinkGrid } from './blocks/LinkGrid'
import { LogoGrid } from './blocks/LogoGrid'
import { MediaBlock } from './blocks/Media'
import { MediaContent } from './blocks/MediaContent'
import { MediaContentAccordion } from './blocks/MediaContentAccordion'
import { Pricing } from './blocks/Pricing'
import { ReusableContent as ReusableContentBlock } from './blocks/ReusableContent'
import { Slider } from './blocks/Slider'
import { Statement } from './blocks/Statement'
import { Steps } from './blocks/Steps'
import { StickyHighlights } from './blocks/StickyHighlights'
import { CaseStudies } from './collections/CaseStudies'
import { Categories } from './collections/Categories'
import { Docs } from './collections/Docs'
import { BannerBlock } from './collections/Docs/blocks/banner'
import { CodeBlock } from './collections/Docs/blocks/code'
import { LightDarkImageBlock } from './collections/Docs/blocks/lightDarkImage'
import { ResourceBlock } from './collections/Docs/blocks/resource'
import { RestExamplesBlock } from './collections/Docs/blocks/restExamples'
import { TableWithDrawersBlock } from './collections/Docs/blocks/tableWithDrawers'
import { UploadBlock } from './collections/Docs/blocks/upload'
import { VideoDrawerBlock } from './collections/Docs/blocks/VideoDrawer'
import { YoutubeBlock } from './collections/Docs/blocks/youtube'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Budgets, Industries, Regions, Specialties } from './collections/PartnerFilters'
import { Partners } from './collections/Partners'
import { Posts } from './collections/Posts'
import { ReusableContent } from './collections/ReusableContent'
import { Users } from './collections/Users'
import { Footer } from './globals/Footer'
import { GetStarted } from './globals/GetStarted'
import { MainMenu } from './globals/MainMenu'
import { PartnerProgram } from './globals/PartnerProgram'
import { TopBar } from './globals/TopBar'
import localization from './i18n/localization'
import { opsCounterPlugin } from './plugins/opsCounter'
import redeployWebsite from './scripts/redeployWebsite'
import { refreshMdxToLexical, syncDocs } from './scripts/syncDocs'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      afterNavLinks: ['@root/components/AfterNavActions'],
    },
    importMap: {
      baseDir: dirname,
    },
  },
  blocks: [
    BlogContent,
    BlogMarkdown,
    CodeExampleBlock,
    MediaExampleBlock,
    Callout,
    CallToAction,
    DownloadBlock,
    LightDarkImageBlock,
    TableWithDrawersBlock,
    YoutubeBlock,
    CardGrid,
    CaseStudyCards,
    CaseStudiesHighlight,
    UploadBlock,
    CaseStudyParallax,
    CodeFeature,
    Content,
    ContentGrid,
    ComparisonTable,
    Form,
    HoverCards,
    HoverHighlights,
    LinkGrid,
    LogoGrid,
    MediaBlock,
    MediaContent,
    MediaContentAccordion,
    RestExamplesBlock,
    Pricing,
    ReusableContentBlock,
    ResourceBlock,
    Slider,
    Statement,
    Steps,
    StickyHighlights,
    ExampleTabs,
    {
      slug: 'spotlight',
      fields: [
        {
          name: 'element',
          type: 'select',
          options: [
            {
              label: 'H1',
              value: 'h1',
            },
            {
              label: 'H2',
              value: 'h2',
            },
            {
              label: 'H3',
              value: 'h3',
            },
            {
              label: 'Paragraph',
              value: 'p',
            },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor(),
        },
      ],
      interfaceName: 'SpotlightBlock',
    },
    {
      slug: 'video',
      fields: [
        {
          name: 'url',
          type: 'text',
        },
      ],
      interfaceName: 'VideoBlock',
    },
    {
      slug: 'br',
      fields: [
        {
          name: 'ignore',
          type: 'text',
        },
      ],

      interfaceName: 'BrBlock',
    },
    VideoDrawerBlock,
    {
      slug: 'commandLine',
      fields: [
        {
          name: 'command',
          type: 'text',
        },
      ],
      interfaceName: 'CommandLineBlock',
    },
    {
      slug: 'command',
      fields: [
        {
          name: 'command',
          type: 'text',
          required: true,
        },
      ],
      labels: {
        plural: 'Command Lines',
        singular: 'Command Line',
      },
    },
    {
      slug: 'link',
      fields: [link()],
      labels: {
        plural: 'Links',
        singular: 'Link',
      },
    },
    {
      slug: 'templateCards',
      fields: [
        {
          name: 'templates',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
            },
            {
              name: 'image',
              type: 'text',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              required: true,
            },
          ],
          labels: {
            plural: 'Templates',
            singular: 'Template',
          },
        },
      ],
      interfaceName: 'TemplateCardsBlock',
    },
    BannerBlock,
    CodeBlock,
    Code,
  ],
  collections: [
    CaseStudies,
    Docs,
    Media,
    Pages,
    Posts,
    Categories,
    ReusableContent,
    Users,
    Partners,
    Industries,
    Specialties,
    Regions,
    Budgets,
  ],
  cors: [
    process.env.PAYLOAD_PUBLIC_APP_URL || '',
    'https://payloadcms.com',
    'https://discord.com/api',
    'https://www.youtube.com/',
    'https://analytics.tomasps.com',
  ].filter(Boolean),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  defaultDepth: 1,
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((feature) => feature.key !== 'link'),
      LinkFeature({
        fields({ defaultFields }) {
          return [
            ...defaultFields.filter((field) => field.name !== 'url'),
            {
              // Own url field to disable URL encoding links starting with '../'
              name: 'url',
              type: 'text',
              label: ({ t }) => t('fields:enterURL'),
              required: true,
              validate: (_value: string, _options) => {
                return
              },
            } as TextField,
          ]
        },
      }),
      EXPERIMENTAL_TableFeature(),
      UploadFeature({
        collections: {
          media: {
            fields: [
              {
                name: 'enableLink',
                type: 'checkbox',
                label: 'Enable Link',
              },
              link({
                appearances: false,
                disableLabel: true,
                overrides: {
                  admin: {
                    condition: (_, data) => Boolean(data?.enableLink),
                  },
                },
              }),
            ],
          },
        },
      }),
      LabelFeature(),
      LargeBodyFeature(),
      BlocksFeature({
        blocks: [
          'spotlight',
          'video',
          'br',
          'Banner',
          'VideoDrawer',
          'templateCards',
          'Code',
          'commandLine',
          'downloadBlock',
        ],
      }),
    ],
  }),
  // email: nodemailerAdapter({
  //   defaultFromAddress: 'hello@safecircle.tech',
  //   defaultFromName: 'SafeCircle',
  //   // Nodemailer transportOptions
  //   transportOptions: {
  //     auth: {
  //       pass: process.env.SMTP_PASS,
  //       user: process.env.SMTP_USER,
  //     },
  //     host: process.env.SMTP_HOST,
  //     port: 587,
  //   },
  // }),
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY || '',
    defaultFromAddress: 'hello@notify.safecircle.tech',
    defaultFromName: 'SafeCircle no-reply',
  }),
  endpoints: [
    {
      handler: syncDocs,
      method: 'get',
      path: '/sync/docs',
    },
    {
      handler: redeployWebsite,
      method: 'post',
      path: '/redeploy/website',
    },
    {
      handler: refreshMdxToLexical,
      method: 'get',
      path: '/refresh/mdx-to-lexical',
    },
  ],
  globals: [Footer, MainMenu, GetStarted, PartnerProgram, TopBar],
  graphQL: {
    disablePlaygroundInProduction: false,
  },
  // localization: {
  //   defaultLocale: 'en', // required
  //   fallback: true, // defaults to true
  //   locales: [
  //     {
  //       code: 'en',
  //       label: 'English',
  //     },
  //     {
  //       code: 'es',
  //       label: 'Spanish',
  //     },
  //     {
  //       code: 'fr',
  //       label: 'French',
  //     },
  //   ],
  // },
  localization,
  plugins: [
    opsCounterPlugin({
      max: 200,
      warnAt: 25,
    }),
    formBuilderPlugin({
      formOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'customID',
            type: 'text',
            admin: {
              description: 'Attached to submission button to track clicks',
              position: 'sidebar',
            },
            label: 'Custom ID',
          },
          {
            name: 'requireTurnstile',
            type: 'checkbox',
            admin: {
              position: 'sidebar',
            },
            label: 'Require Cloudflare Turnstile',
          },
        ],
        hooks: {
          afterChange: [
            ({ doc }) => {
              revalidateTag(`form-${doc.title}`)
              // eslint-disable-next-line no-console
              console.log(`Revalidated form: ${doc.title}`)
            },
          ],
        },
      },
      formSubmissionOverrides: {
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'turnstile',
            type: 'text',
            validate: async (value, { req, siblingData }) => {
              const form = await req.payload.findByID({
                id: siblingData?.form,
                collection: 'forms',
              })

              if (!form?.requireTurnstile) {
                return true
              }

              if (!value) {
                return 'Please complete the verification'
              }

              const formData = new FormData()
              formData.append('secret', process.env.NEXT_PRIVATE_TURNSTILE_SECRET_KEY || '')
              formData.append('response', value)

              const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                body: formData,
                method: 'POST',
              })
              const data = await res.json()
              if (!data.success) {
                return 'Invalid verification token'
              } else {
                return true
              }
            },
          },
        ],
        hooks: {
          afterChange: [
            async ({ doc, req }) => {
              req.payload.logger.info('Form Submission Received')
              req.payload.logger.info(Object.fromEntries(req?.headers.entries()))

              const body = req.json ? await req.json() : {}

              const addToResendNewsletter = async (): Promise<void> => {
                const { addToNewsletterAudience, shouldAddToNewsletter } = await import(
                  './utilities/resend-newsletter'
                )
                const { submissionData } = doc

                if (!submissionData || !Array.isArray(submissionData)) {
                  return
                }

                const newsletterData = shouldAddToNewsletter(submissionData)

                if (newsletterData.shouldAdd && newsletterData.email) {
                  try {
                    const result = await addToNewsletterAudience({
                      email: newsletterData.email,
                      firstName: newsletterData.firstName,
                      lastName: newsletterData.lastName,
                      pageName: 'pageName' in body ? body?.pageName : undefined,
                      pageUri: 'pageUri' in body ? body?.pageUri : undefined,
                      source: 'form-submission',
                    })

                    if (result.success) {
                      req.payload.logger.info(
                        `Successfully added ${newsletterData.email} to newsletter`,
                      )
                    } else {
                      req.payload.logger.warn(
                        `Failed to add ${newsletterData.email} to newsletter: ${result.error}`,
                      )
                    }
                  } catch (err: unknown) {
                    req.payload.logger.error({
                      err,
                      msg: 'Failed to add contact to Resend newsletter',
                    })
                  }
                }
              }

              await addToResendNewsletter()
            },
          ],
        },
      },
    }),
    seoPlugin({
      collections: ['case-studies', 'pages', 'posts'],
      globals: ['get-started'],
      uploadsCollection: 'media',
    }),
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug as string}`, ''),
    }),
    redirectsPlugin({
      collections: ['case-studies', 'pages', 'posts'],
      overrides: {
        hooks: {
          afterChange: [revalidateRedirects],
        },
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
