import React, { useEffect, useRef, useState } from 'react'

export interface TabsProps {
  data: { label: string; content: JSX.Element; id: string }[]
  activeTab: string
  onChange: (tabId: string) => void
}

export function Tabs({ data, activeTab, onChange }: TabsProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(
    data.findIndex((item) => item.id === activeTab),
  )
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0)
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0)

  const tabsRef = useRef<HTMLButtonElement[]>([])

  useEffect(() => {
    function setTabPosition() {
      const currentTab = tabsRef.current[activeTabIndex]
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0)
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0)
    }

    setTabPosition()
    window.addEventListener('resize', setTabPosition)

    return () => window.removeEventListener('resize', setTabPosition)
  }, [activeTabIndex])

  useEffect(() => {
    setActiveTabIndex(data.findIndex((item) => item.id === activeTab))
  }, [activeTab, data])

  return (
    <div>
      <div className="relative">
        <div className="flex space-x-6">
          {data.map((tab, idx) => {
            return (
              <button
                key={idx}
                ref={(el: HTMLButtonElement) => {
                  tabsRef.current[idx] = el
                }}
                className="text-lg mb-2"
                onClick={() => {
                  onChange(tab.id)
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        <span
          className="absolute bottom-0 block h-1 bg-purple-600 transition-all duration-200"
          style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
        />
      </div>
      <div className="mt-8">{data[activeTabIndex].content}</div>
    </div>
  )
}
