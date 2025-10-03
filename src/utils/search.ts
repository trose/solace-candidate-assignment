import { Advocate } from "../types/advocate";

export const filterAdvocates = (advocates: Advocate[], searchTerm: string): Advocate[] => {
  if (!searchTerm.trim()) {
    return advocates;
  }

  const searchLower = searchTerm.toLowerCase();
  return advocates.filter((advocate) => {
    return (
      advocate.firstName.toLowerCase().includes(searchLower) ||
      advocate.lastName.toLowerCase().includes(searchLower) ||
      advocate.city.toLowerCase().includes(searchLower) ||
      advocate.degree.toLowerCase().includes(searchLower) ||
      advocate.specialties.some(specialty => specialty.toLowerCase().includes(searchLower)) ||
      advocate.yearsOfExperience.toString().includes(searchLower)
    );
  });
};