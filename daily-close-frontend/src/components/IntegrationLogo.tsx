import React from 'react';
import { Box, Tooltip } from '@mui/material';

interface IntegrationLogoProps {
  integration: string;
  size?: 'small' | 'medium' | 'large';
}

const IntegrationLogo: React.FC<IntegrationLogoProps> = ({ integration, size = 'medium' }) => {
  const getSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 24;
      case 'large':
        return 32;
      default:
        return 24;
    }
  };

  const getLogoPath = (integration: string) => {
    // Convert integration name to lowercase and replace spaces with hyphens
    const formattedName = integration.toLowerCase().replace(/\s+/g, '-');
    return `/assets/integrations/${formattedName}.svg`;
  };

  return (
    <Tooltip title={integration} placement="top">
      <Box
        component="img"
        src={getLogoPath(integration)}
        alt={`${integration} logo`}
        sx={{
          width: getSize(),
          height: getSize(),
          objectFit: 'contain',
          display: 'block',
          filter: 'grayscale(0.2)',
          opacity: 0.85,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            filter: 'grayscale(0)',
            opacity: 1,
          },
        }}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </Tooltip>
  );
};

export default IntegrationLogo; 