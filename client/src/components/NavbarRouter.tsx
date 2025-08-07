import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import DefaultNavbar from './navbars/DefaultNavbar';
import ClientNavbar from './navbars/ClientNavbar';
import WriterNavbar from './navbars/WriterNavbar';
import ManagerNavbar from './navbars/ManagerNavbar';
import SupportNavbar from './navbars/SupportNavbar';
import AccountantNavbar from './navbars/AccountantNavbar';
import TechNavbar from './navbars/TechNavbar';

const NavbarRouter: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <DefaultNavbar />;
  }

  switch (user.role) {
    case 'client':
      return <ClientNavbar />;
    case 'writer':
      return <WriterNavbar />;
    case 'manager':
      return <ManagerNavbar />;
    case 'support':
      return <SupportNavbar />;
    case 'accountant':
      return <AccountantNavbar />;
    case 'tech':
      return <TechNavbar />;
    default:
      return <DefaultNavbar />;
  }
};

export default NavbarRouter;
