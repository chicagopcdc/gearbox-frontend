import '@react-awesome-query-builder/ui/css/compact_styles.css'
import './AdminPage.css'
import React, { useEffect, useState } from 'react'
import { MatchingPageProps } from './MatchingPage'
import TrialCard from '../components/TrialCard'
import { CriteriaBuilder } from '../components/CriteriaBuilder'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { StudyVersion, StudyVersionStatus } from '../model'
import { getStudyVersions } from '../api/studyVersions'

type TabType = {
  id: StudyVersionStatus
  display: string
}

const tabs: TabType[] = [
  {
    id: 'ACTIVE',
    display: 'Active',
  },
  {
    id: 'IN_PROCESS',
    display: 'In Process',
  },
]

export function AdminPage({
  gearboxState,
}: {
  gearboxState: MatchingPageProps['state']
}) {
  const [currentTab, setCurrentTab] = useState(0)
  const [studyVersions, setStudyVersions] = useState<StudyVersion[]>([])
  const handleTabSelect = (index: number) => setCurrentTab(index)

  useEffect(() => {
    getStudyVersions(tabs[currentTab].id).then((studyVersions) =>
      setStudyVersions(studyVersions)
    )
  }, [currentTab])

  return (
    <Tabs tabIndex={currentTab} onSelect={handleTabSelect}>
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.id}>{tab.display}</Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id}>
          {studyVersions.map((sv) => (
            <TrialCard study={sv.study} key={sv.id}>
              <CriteriaBuilder studyVersion={sv} gearboxState={gearboxState} />
            </TrialCard>
          ))}
        </TabPanel>
      ))}
    </Tabs>
  )
}
