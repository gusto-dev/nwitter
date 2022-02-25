import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Navigation from './Navigation';
import Home from 'routes/Home';
import Auth from 'routes/Auth';
import Profile from 'routes/Profile';

const AppRouter = ({ isLoggedIn, userObj, refreshUser }) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route index element={<Home userObj={userObj} />} />
            <Route
              path="/profile"
              element={<Profile userObj={userObj} refreshUser={refreshUser} />}
            />
          </>
        ) : (
          <Route index element={<Auth />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
