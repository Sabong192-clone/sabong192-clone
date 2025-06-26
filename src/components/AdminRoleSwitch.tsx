// 📁 src/components/AdminRoleSwitch.tsx
import { updateUserRole } from "../utils/updateUserRole";

export const AdminRoleSwitch = ({ userId }) => (
  <div className="space-x-2">
    <button onClick={() => updateUserRole(userId, "admin")} className="bg-blue-500 text-white px-2 py-1 rounded">Make Admin</button>
    <button onClick={() => updateUserRole(userId, "user")} className="bg-gray-500 text-white px-2 py-1 rounded">Revert to User</button>
  </div>
);


// 📁 src/components/ASIControl.tsx
import { updateASIStatus } from "../utils/updateASIStatus";

export const ASIControl = () => (
  <div className="flex space-x-4">
    <button onClick={() => updateASIStatus("Operational")} className="bg-green-500 text-white px-4 py-2 rounded">Activate ASI</button>
    <button onClick={() => updateASIStatus("Standby")} className="bg-yellow-500 text-white px-4 py-2 rounded">Pause ASI</button>
  </div>
);