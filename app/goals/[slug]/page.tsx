import { Metadata } from "next"
import { notFound } from "next/navigation"

interface Goal {
  id: number
  title: string
  target_amount: number
  current_amount: number
  current_foreign_usd: number
  about?: string | null
  is_active: boolean
  is_completed: boolean
  created_at: string
  completed_at?: string | null
  creator_name: string
}

interface GoalPageProps {
  params: { slug: string }
}

export  const revalidate = 3600

export async function generateMetadata({
  params,
}: GoalPageProps): Promise<Metadata> {
  const res = await fetch(
    `https://api.tippified.com/api/auth/public/goals/${params.slug}/`
  )

  if (!res.ok) {
    return {
      title: "Goal not found | Tippified",
    }
  }

  const goal: Goal = await res.json()

  const title = `Support ${goal.creator_name}'s Goal – ${goal.title} | Tippified`

  const description = `${goal.creator_name} created a goal on Tippified to raise ₦${goal.target_amount}. Support this creator and help them reach their goal.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://tippified.com/goals/${params.slug}`,
      siteName: "Tippified",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function GoalPage({ params }: GoalPageProps) {
  const res = await fetch(
    `https://api.tippified.com/api/auth/public/goals/${params.slug}/`,
   
  )

  if (!res.ok) {
    notFound() 
  }

  const goal: Goal = await res.json()

  return (
    <div>
      <h1>{goal.title} – Goal by {goal.creator_name}</h1>

      <p>
        {goal.creator_name} created this goal on Tippified to raise ₦
        {goal.target_amount}.
      </p>

      <p>{goal.about}</p>
    </div>
  )
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      "https://api.tippified.com/api/auth/public/goals/"
    )

    if (!res.ok) return []

    const data = await res.json()

    const goals = data.results || data

    if (!Array.isArray(goals)) return []

    return goals.map((goal: { slug: string }) => ({
      slug: goal.slug,
    }))
  } catch {
    return []
  }
}