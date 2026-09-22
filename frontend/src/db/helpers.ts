export const nowUnix = (): number => Math.floor(Date.now() / 1000)

export const newUuid = (): string => crypto.randomUUID()
