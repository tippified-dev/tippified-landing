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

// SSR for each goal page
export default async function GoalPage({ params }: GoalPageProps) {
  const res = await fetch(
    `https://api.tippified.com/api/auth/public/goals/${params.slug}/`,
    { cache: "no-store" } 
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
  const res = await fetch(
    "https://api.tippified.com/api/auth/public/goals/",
    { cache: "no-store" }
  )

  const data = await res.json()

  const goals = data.results || data

  return goals.map((goal: { slug: string }) => ({
    slug: goal.slug,
  }))
}