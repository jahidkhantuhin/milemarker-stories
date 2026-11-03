import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import Discover from './places/pages/Discover';
import SavedPlaces from './places/pages/SavedPlaces';
import TripPlanner from './places/pages/TripPlanner';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { TravelContext } from './shared/context/travel-context';
import { useAuth } from './shared/hooks/auth-hook';
import { useTravel } from './shared/hooks/travel-hook';

const App = () => {
  const { token, login, logout, userId } = useAuth();
  const travel = useTravel();

  return (
    <TravelContext.Provider value={travel}>
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main><Switch>
          <Route path="/" exact><Discover /></Route>
          <Route path="/community" exact><Users /></Route>
          <Route path="/saved" exact><SavedPlaces /></Route>
          <Route path="/trip-planner" exact><TripPlanner /></Route>
          <Route path="/:userId/places" exact><UserPlaces /></Route>
          <Route path="/auth"><Auth /></Route>
          {token && <Route path="/places/new" exact><NewPlace /></Route>}
          {token && <Route path="/places/:placeId"><UpdatePlace /></Route>}
          <Redirect to={token ? '/' : '/auth'} />
        </Switch></main>
      </Router>
    </AuthContext.Provider>
    </TravelContext.Provider>
  );
};

export default App;
