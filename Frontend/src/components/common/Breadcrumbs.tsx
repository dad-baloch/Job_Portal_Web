import { Link, useLocation } from 'react-router-dom'

export function Breadcrumbs() {
    const location = useLocation()
    const parts = location.pathname.split('/').filter(Boolean)

    if (parts.length === 0) return null

    return (
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
            <ol className="flex flex-wrap items-center gap-2">
                <li>
                    <Link className="hover:text-black" to="/">
                        Home
                    </Link>
                </li>
                {parts.map((part, idx) => {
                    const path = '/' + parts.slice(0, idx + 1).join('/')
                    const isLast = idx === parts.length - 1

                    const isDeadDashboardIntermediate =
                        path === '/dashboard/jobs' ||
                        path === '/dashboard/admin' ||
                        path === '/dashboard/admin/jobs'

                    return (
                        <li key={path} className="flex items-center gap-2">
                            <span>/</span>
                            {isLast ? (
                                <span className="text-gray-900">{part}</span>
                            ) : isDeadDashboardIntermediate ? (
                                <span>{part}</span>
                            ) : (
                                <Link className="hover:text-black" to={path}>
                                    {part}
                                </Link>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
