"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

import { Routes } from "@/lib/pageroutes"
import SubLink from "@/components/navigation/sublink"

export default function PageMenu({ isSheet = false }) {
  const pathname = usePathname()
  const [openItem, setOpenItem] = useState<string | null>(null)
  // Auto-expansion disabled as per user request
  // useEffect(() => {
  //   const activeRoute = Routes.find(
  //     (item) =>
  //       !('spacer' in item) &&
  //       item.href &&
  //       pathname.includes(`/docs${item.href}`)
  //   )
  //   if (activeRoute && !('spacer' in activeRoute)) {
  //     setOpenItem(`/docs${activeRoute.href}`)
  //   }
  // }, [pathname])

  if (!pathname.startsWith("/docs")) return null

  return (
    <div className="mt-5 flex flex-col gap-3.5 pb-6">
      {Routes.map((item, index) => {
        if ("spacer" in item) {
          return (
            <div key={`spacer-${index}`} className="my-2 mr-3">
              <hr className="border-t border-gray-300" />
            </div>
          )
        }

        const href = `/docs${item.href}`

        return (
          <div key={item.title + index} className="mb-2">
            {item.heading && (
              <div className="mb-2 text-sm font-bold">{item.heading}</div>
            )}
            <SubLink
              {...{
                ...item,
                href: href,
                level: 0,
                isSheet,
                isOpen: openItem === href,
                onOpenChange: (open) => {
                  if (open) {
                    setOpenItem(href)
                  } else if (openItem === href) {
                    setOpenItem(null)
                  }
                },
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
