// Role-based redirect utility
export type UserRole = 'client' | 'writer' | 'manager' | 'support' | 'accountant' | 'tech';

export const getRoleBasedDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case 'client':
      return '/client/dashboard';
    case 'writer':
      return '/writers/dashboard';
    case 'manager':
      return '/admin/manager';
    case 'support':
      return '/admin/support';
    case 'accountant':
      return '/admin/accountant';
    case 'tech':
      return '/admin/tech';
    default:
      return '/client/dashboard'; // fallback to client dashboard
  }
};

export const getRoleDashboardTitle = (role: UserRole): string => {
  switch (role) {
    case 'client':
      return 'Client Dashboard';
    case 'writer':
      return 'Writer Dashboard';
    case 'manager':
      return 'Manager Dashboard';
    case 'support':
      return 'Support Dashboard';
    case 'accountant':
      return 'Accountant Dashboard';
    case 'tech':
      return 'Tech Dashboard';
    default:
      return 'Dashboard';
  }
};
