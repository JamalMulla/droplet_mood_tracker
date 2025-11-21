export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDaysInYear = (year: number): Date[] => {
  const days: Date[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return days;
};

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return formatDate(date) === formatDate(today);
};
