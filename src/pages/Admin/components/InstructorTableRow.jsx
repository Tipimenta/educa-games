import { FormattedDate, StatusBadge } from '../../../components';
import InstructorActions from './InstructorActions';

const InstructorTableRow = ({ item, tab, actions }) => {
  const isInvitesTab = tab === 'invites';

  return (
    <>
      {!isInvitesTab && (
        <td className="px-6 py-4 text-left align-middle text-base font-medium text-gray-900">
          {item.name}
        </td>
      )}

      <td className="px-6 py-4 text-left align-middle text-base text-blue-600">{item.email}</td>

      {isInvitesTab && (
        <>
          <td className="px-6 py-4 text-center align-middle text-base">
            <StatusBadge status={item.status} variant="pending" />
          </td>
          <td className="px-6 py-4 text-center align-middle text-base text-gray-700">
            <FormattedDate date={item.expiresAt} />
          </td>
        </>
      )}

      <td className="px-6 py-4 text-center align-middle">
        <div className="flex items-center justify-center gap-1">
          <InstructorActions tab={tab} item={item} actions={actions} />
        </div>
      </td>
    </>
  );
};

export default InstructorTableRow;
