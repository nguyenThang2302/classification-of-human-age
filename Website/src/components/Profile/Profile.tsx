import React, { useEffect, useState } from 'react';
import '../Profile/Profile.css';
import { fetchProfileData } from '@/services/user/getProfile';

type ProfileData = {
  name: string;
  email: string;
};

const Profile = () => {
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await fetchProfileData();
        setUserProfile(user.data.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="profile-container">
      {userProfile && (
        <>
          <img
            className="profile-avatar"
            src="https://res.cloudinary.com/dxsdyc667/image/upload/v1725939410/udtt7a2uwjbr2pupjnfb.jpg"
            alt="Avatar"
          />
          <h2 className="profile-name">{userProfile.name}</h2>
          <p className="profile-email">{userProfile.email}</p>
        </>
      )}
    </div>
  );
};

export default Profile;
