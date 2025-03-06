import client from "../db";

// Define roles
type Role = "admin" | "agent" | "customer";

interface Permissions {
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canAdd: boolean;
}

// Permissions map based on roles
const rolePermissions: Record<Role, Permissions> = {
  admin: { canEdit: true, canDelete: true, canView: true, canAdd: true },
  agent: { canEdit: false, canDelete: false, canView: true, canAdd: false },
  customer: { canEdit: false, canDelete: false, canView: true, canAdd: false },
};

// Function to fetch user role and permissions
export const getUserPermissions = async (userId: string): Promise<Permissions | null> => {
  console.log("Received userId: "+ userId);
  try {
    const query = "SELECT role FROM users WHERE id = $1";
    const result = await client.query(query, [userId]);
    
    if (result.rows.length === 0) return null;

    const { role } = result.rows[0] as { role: Role };

    return rolePermissions[role];
  } catch (error) {
    console.error("Error fetching user permissions:", error);
    return null;
  }
};
