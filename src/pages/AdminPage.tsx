import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'

export function AdminPage({ isAdmin }: { isAdmin: boolean }) {
  const location = useLocation()
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }
  return (
    <>
      {location.pathname === '/admin' && (
        <ol>
          <li>
            <Link to="/admin/criteria-builder">Study Criteria Builder</Link>
          </li>
          <li>
            <Link to="/admin/question-editor">Question Editor</Link>
          </li>
          <li>
            <Link to="/admin/question-adjudication">Question Adjudication</Link>
          </li>
        </ol>
      )}
      <Outlet />
    </>
  )
}
