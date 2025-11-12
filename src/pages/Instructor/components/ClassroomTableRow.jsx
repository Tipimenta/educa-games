import { Link } from 'react-router-dom';

import { FormattedDate } from '../../../components';

const ClassroomTableRow = ({ item }) => {
  return (
    <>
      <td className="px-6 py-4 text-left align-middle text-base font-medium text-blue-600">
        <Link to={`/instructor/classroom/${item.id}`} className="hover:underline">
          {item.name}
        </Link>
      </td>
      <td className="px-6 py-4 text-center align-middle text-base text-gray-700">
        <FormattedDate date={item.createdAt} />
      </td>
    </>
  );
};

export default ClassroomTableRow;