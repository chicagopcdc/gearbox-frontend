import React from 'react'

const styles = {
  container:
    'border border-solid border-black hover:border-red-500 hover:bg-red-100 m-4 py-4 px-8',
  title: 'font-bold text-lg pb-2',
  subtitle: 'font-bold py-2',
}

export type Trial = {
  title: string
  group: string
  location: string
  registerLinks: { name: string; url: string }[]
}

const TrialCard = ({
  data: { title, group, location, registerLinks },
}: {
  data: Trial
}) => (
  <div className={styles.container}>
    <h2 className={styles.title}>{title}</h2>

    <h3 className={styles.subtitle}>Research group</h3>
    <p>{group}</p>

    <h3 className={styles.subtitle}>Location</h3>
    <p>{location}</p>

    <h3 className={styles.subtitle}>Registration information</h3>
    {registerLinks?.map(({ name, url }) => (
      <a className="block text-blue-700" href={url} target="blank">
        {name}
      </a>
    ))}
  </div>
)

export default TrialCard
