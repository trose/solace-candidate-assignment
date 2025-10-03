import { Advocate } from "../types/advocate";

interface AdvocateRowProps {
  advocate: Advocate;
}

export const AdvocateRow: React.FC<AdvocateRowProps> = ({ advocate }) => {
  const formatPhoneNumber = (phone: number) => {
    const phoneStr = phone.toString();
    return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="border border-gray-300 px-4 py-2">{advocate.firstName}</td>
      <td className="border border-gray-300 px-4 py-2">{advocate.lastName}</td>
      <td className="border border-gray-300 px-4 py-2">{advocate.city}</td>
      <td className="border border-gray-300 px-4 py-2">{advocate.degree}</td>
      <td className="border border-gray-300 px-4 py-2">
        <div className="flex flex-wrap gap-1">
          {advocate.specialties.map((specialty) => (
            <span 
              key={specialty}
              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>
      </td>
      <td className="border border-gray-300 px-4 py-2 text-center">
        {advocate.yearsOfExperience}
      </td>
      <td className="border border-gray-300 px-4 py-2 font-mono">
        {formatPhoneNumber(advocate.phoneNumber)}
      </td>
    </tr>
  );
};