import React from 'react';
import { Avatar, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  fontSize: '0.85rem',
  fontWeight: 500,
}));

// Stock images for avatars
const AVATAR_IMAGES = {
  pip: 'https://raw.githubusercontent.com/EY-X/ey-assets/main/pip-avatar.png',
  human: 'https://raw.githubusercontent.com/EY-X/ey-assets/main/human-avatar.png'
};

interface UserAvatarProps {
  name: string;
  size?: 'small' | 'medium';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = 'medium' }) => {
  const normalizedName = name.toLowerCase();
  const isPip = normalizedName === 'pip';
  
  const avatarSize = size === 'small' ? { width: 20, height: 20 } : { width: 24, height: 24 };
  
  return (
    <Tooltip title={name}>
      <StyledAvatar
        src={isPip ? AVATAR_IMAGES.pip : AVATAR_IMAGES.human}
        sx={avatarSize}
      />
    </Tooltip>
  );
};

export default UserAvatar; 