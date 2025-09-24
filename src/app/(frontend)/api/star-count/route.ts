import { NextResponse } from 'next/server'

export const revalidate = 900

export async function GET(): Promise<NextResponse> {
  const { stargazers_count: totalStars } = await fetch(
    'https://api.github.com/repos/safecircleia/demo',
    {
      headers: {
        Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        'User-Agent': 'safecircleia-landing',
      },
    },
  ).then((res) => res.json())

  return NextResponse.json({ totalStars })
}
