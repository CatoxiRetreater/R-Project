import React from 'react';
import { Link } from 'react-router-dom';
import { FilmIcon, UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  showBackButton?: boolean;
  backUrl?: string;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, backUrl = '/dashboard' }) => {
  const { user } = useAuth();

  return (
    <header className="bg-black/30 p-4 md:px-8 shadow-md flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <FilmIcon size={32} className="text-accent" />
        <div className="text-xl font-semibold">Movie Sentiment Analysis</div>
      </div>
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Link to={backUrl} className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i>
            Back
          </Link>
        )}
        <div className="flex items-center gap-4">
          <span id="user-name" className="hidden md:inline-block">Welcome, {user?.name || 'User'}</span>
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white">
            <UserIcon size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;