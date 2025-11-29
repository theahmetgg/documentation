import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
      <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
        Documentation
      </h1>
      <p className="mb-8 max-w-[600px] text-lg text-muted-foreground">
        Welcome to the documentation. You can access the articles and tutorials from the menu on the left.
      </p>
      <div className="flex gap-4">
        <Link
          href="/docs/javascript/basic/tutorial"
          className={buttonVariants({ size: "lg" })}
        >
          Start Learning
        </Link>
      </div>
    </div>
  )
}
