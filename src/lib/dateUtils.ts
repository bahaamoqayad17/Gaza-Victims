import { format, differenceInDays } from 'date-fns';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy');
};

export const calculateDaysSince = (dateString: string): number => {
  const date = new Date(dateString);
  const today = new Date();
  return differenceInDays(today, date);
};