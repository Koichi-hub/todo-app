type StatusTimeBlockProps = {
    completed: number
    total: number
    recordedTimeInSecs: number
}

function formatRecordedTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
        return `${hours}ч ${minutes}м`
    }
    return `${minutes}м`
}

export default function StatusTimeBlock({ completed, total, recordedTimeInSecs }: StatusTimeBlockProps) {
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return (
        <div className="bg-white/10 border border-white/20 rounded-2xl p-3">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                    <span className="text-white text-20px">{completed} / {total}</span>
                    <span className="text-white text-20px">{percentage}%</span>
                </div>
                <span className="text-white text-20px">{formatRecordedTime(recordedTimeInSecs)}</span>
            </div>
        </div>
    )
}
