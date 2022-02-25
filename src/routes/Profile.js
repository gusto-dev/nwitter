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
    <div className="max-container">
      <div className="container">
        <form onSubmit={onSubmit} className="profileForm">
          <input
            type="text"
            placeholder="Display name"
            value={newDisplayName}
            onChange={onChange}
            autoFocus
            className="formInput"
          />
          <input
            type="submit"
            value="Update Profile"
            className="formBtn"
            style={{
              marginTop: 10,
            }}
          />
        </form>
        <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
          Log Out
        </span>
        <div style={{ marginTop: 40 }}>
          {nweets.map((nweet) => (
            <Nweet
              key={nweet.creatorId}
              nweetObj={nweet}
              isOwner={nweet.creatorId === userObj.uid}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
