import { useState, useMemo } from "react";
import { Advocate } from "../types/advocate";
import { AdvocateRow } from "./AdvocateRow";

interface AdvocateTableProps {
  advocates: Advocate[];
}

type SortField = 'firstName' | 'lastName' | 'city' | 'degree' | 'yearsOfExperience' | 'phoneNumber';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField | null;
  direction: SortDirection;
}

export const AdvocateTable: React.FC<AdvocateTableProps> = ({ advocates }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: null, direction: 'asc' });

  const handleSort = (field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      direction: prevConfig.field === field && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedAdvocates = useMemo(() => {
    if (!sortConfig.field) return advocates;

    return [...advocates].sort((a, b) => {
      const aValue = a[sortConfig.field!];
      const bValue = b[sortConfig.field!];

      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [advocates, sortConfig]);

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) {
      return (
        <span className="text-gray-400" aria-label="Sortable">
          ↕️
        </span>
      );
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <caption className="text-lg font-semibold mb-4 text-left">
          Advocates List ({advocates.length} total)
        </caption>
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('firstName')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSort('firstName')}
              aria-label="Sort by first name"
            >
              <div className="flex items-center gap-2">
                First Name
                {getSortIcon('firstName')}
              </div>
            </th>
            <th 
              scope="col" 
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('lastName')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSort('lastName')}
              aria-label="Sort by last name"
            >
              <div className="flex items-center gap-2">
                Last Name
                {getSortIcon('lastName')}
              </div>
            </th>
            <th 
              scope="col" 
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('city')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSort('city')}
              aria-label="Sort by city"
            >
              <div className="flex items-center gap-2">
                City
                {getSortIcon('city')}
              </div>
            </th>
            <th 
              scope="col" 
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('degree')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSort('degree')}
              aria-label="Sort by degree"
            >
              <div className="flex items-center gap-2">
                Degree
                {getSortIcon('degree')}
              </div>
            </th>
            <th scope="col" className="border border-gray-300 px-4 py-2 text-left">
              Specialties
            </th>
            <th 
              scope="col" 
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('yearsOfExperience')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSort('yearsOfExperience')}
              aria-label="Sort by years of experience"
            >
              <div className="flex items-center gap-2">
                Years of Experience
                {getSortIcon('yearsOfExperience')}
              </div>
            </th>
            <th 
              scope="col" 
              className="border border-gray-300 px-4 py-2 text-left cursor-pointer hover:bg-gray-100 select-none"
              onClick={() => handleSort('phoneNumber')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSort('phoneNumber')}
              aria-label="Sort by phone number"
            >
              <div className="flex items-center gap-2">
                Phone Number
                {getSortIcon('phoneNumber')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedAdvocates.map((advocate) => (
            <AdvocateRow key={advocate.id} advocate={advocate} />
          ))}
        </tbody>
      </table>
    </div>
  );
};