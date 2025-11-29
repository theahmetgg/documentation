import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { LuChevronDown, LuChevronRight } from "react-icons/lu"

import { Paths } from "@/lib/pageroutes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { SheetClose } from "@/components/ui/sheet"
import Anchor from "@/components/navigation/anchor"

function isRoute(
  item: Paths
): item is Extract<Paths, { title: string; href: string }> {
  return "title" in item && "href" in item
}

export default function SubLink(
  props: Paths & {
    level: number
    isSheet: boolean
    isOpen?: boolean
    onOpenChange?: (open: boolean) => void
  }
) {
  const path = usePathname()
  const { isOpen: propsIsOpen, onOpenChange } = props
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [openChild, setOpenChild] = useState<string | null>(null)

  const isOpen = propsIsOpen !== undefined ? propsIsOpen : internalIsOpen
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    } else {
      setInternalIsOpen(open)
    }
  }

  useEffect(() => {
    if (
      isRoute(props) &&
      props.href &&
      path !== props.href &&
      path.includes(props.href)
    ) {
      setIsOpen(true)
    }
  }, [path, props])

  // Initialize openChild based on current path
  useEffect(() => {
    if (isRoute(props) && props.items) {
      const activeChild = props.items.find(
        (item) =>
          isRoute(item) &&
          path.includes(`${props.href}${item.href}`)
      )
      if (activeChild && isRoute(activeChild)) {
        setOpenChild(`${props.href}${activeChild.href}`)
      }
    }
  }, [path, props])

  if (!isRoute(props)) {
    return null
  }

  const { title, href, items, noLink, level, isSheet } = props

  const Comp = (
    <Anchor activeClassName="text-primary text-sm font-medium" href={href}>
      {title}
    </Anchor>
  )

  const titleOrLink = !noLink ? (
    isSheet ? (
      <SheetClose asChild>{Comp}</SheetClose>
    ) : (
      Comp
    )
  ) : (
    <h2 className="text-primary font-medium sm:text-sm">{title}</h2>
  )

  if (!items) {
    return <div className="flex flex-col text-sm">{titleOrLink}</div>
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="mr-3 flex items-center gap-2 text-sm">
          {titleOrLink}
          <CollapsibleTrigger asChild>
            <Button className="ml-auto h-6 w-6" variant="link" size="icon">
              {!isOpen ? (
                <LuChevronRight className="h-[0.9rem] w-[0.9rem]" />
              ) : (
                <LuChevronDown className="h-[0.9rem] w-[0.9rem]" />
              )}
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="CollapsibleContent">
          <div
            className={cn(
              "mt-2.5 flex flex-col items-start gap-3 border-l pl-4 text-sm text-neutral-800 dark:text-neutral-300/85",
              level > 0 && "ml-1 border-l pl-4"
            )}
          >
            {items?.map((innerLink) => {
              if (!isRoute(innerLink)) {
                return null
              }

              const modifiedItems = {
                ...innerLink,
                href: `${href}${innerLink.href}`,
                level: level + 1,
                isSheet,
              }

              const childHref = modifiedItems.href

              return (
                <SubLink
                  key={childHref}
                  {...modifiedItems}
                  isOpen={openChild === childHref}
                  onOpenChange={(open) => {
                    if (open) {
                      setOpenChild(childHref)
                    } else if (openChild === childHref) {
                      setOpenChild(null)
                    }
                  }}
                />
              )
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
