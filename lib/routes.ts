export function lessonPath(lesson: number, step = 0) {
  return `/learn/${lesson + 1}/${step + 1}`;
}

export function routeIndex(value: string, length: number) {
  const number = Number(value);
  return Number.isSafeInteger(number) && String(number) === value && number >= 1 && number <= length
    ? number - 1 : -1;
}
