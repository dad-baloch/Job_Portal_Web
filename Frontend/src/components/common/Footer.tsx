import { APP_NAME } from '../../constants'

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="mx-auto max-w-7xl px-4 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-xl font-bold tracking-tight text-gray-900">{APP_NAME}</span>
                        <p className="text-sm text-gray-500 mt-1">Found your next dream job.</p>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-1">
                        <p className="text-sm text-gray-600 font-medium">
                            Designed & Developed by <span className="text-black font-bold">Daad</span>
                        </p>
                        <p className="text-xs text-gray-400">
                            © {new Date().getFullYear()} All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
