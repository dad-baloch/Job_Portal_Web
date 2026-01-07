import { Link } from 'react-router-dom'

import { Button } from '../components/common/Button'

export function NotFoundPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-16">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="mt-2 text-gray-600">
                The page you’re looking for doesn’t exist.
            </p>
            <div className="mt-6">
                <Link to="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        </div>
    )
}
