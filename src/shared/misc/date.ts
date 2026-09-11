export const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const

export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${day}.${month}`
}

export function formatDateWithDay(date: Date): string {
    const jsDayIndex = date.getDay()
    const dayIndex = jsDayIndex === 0 ? 6 : jsDayIndex - 1
    const dayShort = DAY_NAMES[dayIndex]
    const dayPadded = String(date.getDate()).padStart(2, '0')
    const monthPadded = String(date.getMonth() + 1).padStart(2, '0')
    return `${dayShort} ${dayPadded}.${monthPadded}.${date.getFullYear()}`
}

export function formatDateFull(date: Date): string {
    return date.toLocaleDateString('ru-RU')
}

export function getWeekDates(date: Date): Date[] {
    const start = new Date(date)
    const day = start.getDay()
    const diff = day === 0 ? -6 : 1 - day
    start.setDate(start.getDate() + diff)
    const dates: Date[] = []
    for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        dates.push(d)
    }
    return dates
}

export function getDateKey(date: Date): string {
    return date.toISOString().split('T')[0]
}

export function isToday(date: Date): boolean {
    return getDateKey(date) === getDateKey(new Date())
}
