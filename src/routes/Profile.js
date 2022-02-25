import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

import { authService, dbService } from 'fbase';
import Nweet from 'components/Nweet';

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const [nweets, setNweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName ?? '');

  const onLogOutClick = () => {
    authService.signOut();
    navigate('/');
  };

  const getMyNweets = useCallback(async () => {
    const querySnapshot = await getDocs(
      query(
        collection(dbService, 'nweets'),
        where('creatorId', '==', userObj.uid),
        orderBy('createdAt', 'asc')
      )
    );
    querySnapshot.forEach((doc) => {
      setNweets((prev) => [...prev, doc.data()]);
    });
  }, [userObj.uid]);

  useEffect(() => {
    getMyNweets();
  }, [getMyNweets]);

  const onChange = (e) => {
    const { value } = e.target;
    setNewDisplayName(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, { displayName: newDisplayName });
      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Display name" value={newDisplayName} onChange={onChange} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      <div>
        {nweets.map((nweet) => (
          <Nweet key={nweet.creatorId} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        ))}
      </div>
    </>
  );
};

export default Profile;
