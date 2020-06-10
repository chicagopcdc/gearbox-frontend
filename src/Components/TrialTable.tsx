import React from 'react'

type Trial = {
  title: string
  group: string
  location: string
  link: { name: string; url: string }
  contact: string
}

const TrialTable = ({ data }: { data: Trial[] }) => <div></div>

export default TrialTable
