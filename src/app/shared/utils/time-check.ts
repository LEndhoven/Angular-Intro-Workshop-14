export function isValidTimeDuration(timeExpression: string): boolean {
  // Checks a 24-hour format HH:mm with optional leading 0
  const timeVdlidationExpression = new RegExp(
    '^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'
  );

  return timeVdlidationExpression.test(timeExpression);
}

export function convertTimeExpressinToMinutes(timeExpression: string): number {
  return isValidTimeDuration(timeExpression)
    ? Number(timeExpression.split(':')[0]) * 60 +
        Number(timeExpression.split(':')[1])
    : 0;
}
