import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users`
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <>
        <section className="hero-shell">
          <div className="hero-copy"><span className="eyebrow">A FIELD GUIDE BY REAL PEOPLE</span><h1>Go where the story<br/><em>takes you.</em></h1><p>Thoughtful travel notes from curious people. Find a place worth remembering, then make it yours.</p><a className="hero-cta" href="#travelers">Explore the community <span>↘</span></a></div>
          <div className="hero-image" role="img" aria-label="A quiet coastal village at golden hour"><span className="image-note">THE WORLD, A LITTLE CLOSER <b>✳</b></span></div>
          <div className="hero-stats"><div><strong>01</strong><span>Find your people</span></div><div><strong>02</strong><span>Save their places</span></div><div><strong>03</strong><span>Write your own story</span></div></div>
        </section>
        <section className="community-section" id="travelers"><div className="section-heading"><div><span className="eyebrow">THE TRAVEL JOURNAL</span><h2>Notes from the road<span>.</span></h2></div><p>Small discoveries. Big feelings.<br/>All shared by travellers like you.</p></div><UsersList items={loadedUsers} /></section>
      </>}
    </React.Fragment>
  );
};

export default Users;
