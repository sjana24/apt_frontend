/**
 * Interface for the returned week range
 */
export interface WeekRange {
  monday: string;
  friday: string;
}

/**
 * Calculates the Monday and Friday dates for the week of a given date.
 * @param selectedDate - The date selected by the user (Date object)
 * @returns An object containing ISO date strings for Monday and Friday
 */
export const getWeekRange = (selectedDate: Date | undefined): WeekRange | null => {
  if (!selectedDate) return null;

  const date = new Date(selectedDate);
  
  // getDay() returns 0 for Sunday, 1 for Monday...
  const day = date.getDay(); 

  // Calculate Monday
  const monday = new Date(date);
  // If Sunday (0), move back 6 days. Otherwise, move back to Monday (1 - day)
  const diffToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(date.getDate() + diffToMonday);

  // Calculate Friday
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  return {
    monday: monday.toISOString().split('T')[0],
    friday: friday.toISOString().split('T')[0]
  };
};