import { Link } from 'react-router-dom'

export function AdminPage() {
  return (
    <ol>
      <li>
        <Link to="/admin/criteria-builder">Study Criteria Builder</Link>
      </li>
      <li>
        <Link to="/admin/question-editor">Question Editor</Link>
      </li>
    </ol>
  )
}
