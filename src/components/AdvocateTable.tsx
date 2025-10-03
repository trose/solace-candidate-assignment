import { Advocate } from "../types/advocate";
import { AdvocateRow } from "./AdvocateRow";

interface AdvocateTableProps {
  advocates: Advocate[];
}

export const AdvocateTable: React.FC<AdvocateTableProps> = ({ advocates }) => {
  return (
    <table>
      <caption>Advocates List</caption>
      <thead>
        <tr>
          <th scope="col">First Name</th>
          <th scope="col">Last Name</th>
          <th scope="col">City</th>
          <th scope="col">Degree</th>
          <th scope="col">Specialties</th>
          <th scope="col">Years of Experience</th>
          <th scope="col">Phone Number</th>
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