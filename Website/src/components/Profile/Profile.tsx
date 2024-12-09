import React, { useEffect, useState } from 'react';
import '../Profile/Profile.css';
import { useSession } from "@/hooks";

const Profile = () => {
  const { userProfile } = useSession();
  return (
    <div className="profile-container">
      <img
        className="profile-avatar"
        src="https://res.cloudinary.com/dxsdyc667/image/upload/v1725939410/udtt7a2uwjbr2pupjnfb.jpg"
        alt="Avatar"
      />
      <h2 className="profile-name">{userProfile?.name}</h2>
      <p className="profile-email">{userProfile?.email}</p>
    </div>
  );
};

export default Profile;
