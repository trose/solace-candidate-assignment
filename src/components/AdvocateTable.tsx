import { Advocate } from "../types/advocate";
import { AdvocateRow } from "./AdvocateRow";

interface AdvocateTableProps {
  advocates: Advocate[];
}

export const AdvocateTable: React.FC<AdvocateTableProps> = ({ advocates }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>City</th>
          <th>Degree</th>
          <th>Specialties</th>
          <th>Years of Experience</th>
          <th>Phone Number</th>
        </tr>
      </thead>
      <tbody>
        {advocates.map((advocate) => (
          <AdvocateRow key={advocate.id} advocate={advocate} />
        ))}
      </tbody>
    </table>
  );
};