import '@react-awesome-query-builder/ui/css/compact_styles.css'
import './CriteriaBuilderPage.css'
import React, { useEffect, useRef, useState } from 'react'
import { MatchingPageProps } from './MatchingPage'
import TrialCard from '../components/TrialCard'
import { CriteriaBuilder } from '../components/CriteriaBuilder'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import { ApiStatus, StudyVersionStatus } from '../model'
import { useStudyVersions } from '../hooks/useStudyVersions'
import { ErrorRetry } from '../components/ErrorRetry'
import Button from '../components/Inputs/Button'
import { publishMatchForm } from '../utils'
import { AlertCircle, Check, Loader } from 'react-feather'
import { PublishMatchForm } from '../components/PublishMatchForm'

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

export function CriteriaBuilderPage({
  gearboxState,
}: {
  gearboxState: MatchingPageProps['state']
}) {
  const [currentTab, setCurrentTab] = useState(0)
  const handleTabSelect = (index: number) => setCurrentTab(index)

  const [studyVersions, setStudyVersions, loadingStatus, fetchStudyVersion] =
    useStudyVersions(tabs[currentTab].id)

  return (
    <Tabs tabIndex={currentTab} onSelect={handleTabSelect}>
      <TabList>
        {tabs.map((tab) => (
          <Tab key={tab.id}>{tab.display}</Tab>
        ))}
      </TabList>
      {tabs.map((tab) => (
        <TabPanel key={tab.id}>
          {loadingStatus === 'not started' || loadingStatus === 'sending' ? (
            <div>Loading...</div>
          ) : loadingStatus === 'error' ? (
            <ErrorRetry retry={fetchStudyVersion} />
          ) : (
            <>
              <PublishMatchForm />
              {studyVersions.map((sv) => (
                <TrialCard study={sv.study} key={sv.id}>
                  <CriteriaBuilder
                    studyVersions={studyVersions}
                    setStudyVersions={setStudyVersions}
                    studyVersion={sv}
                    gearboxState={gearboxState}
                  />
                </TrialCard>
              ))}
            </>
          )}
        </TabPanel>
      ))}
    </Tabs>
  )
}
