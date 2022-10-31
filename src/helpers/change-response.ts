export default function changeResponse<T = Record<string, any>>(data: string, keys: (keyof T)[]): T[] {
  const split = data.split('@@')
  return split.reduce((prev, current) => {
    const curSplit = current.split('##')
    const re = {} as T
    for (const [ i, val ] of keys.entries()) {
      re[val] = curSplit[i] as T[keyof T]
    }
    prev.push(re)
    return prev
  }, [] as T[])
}
