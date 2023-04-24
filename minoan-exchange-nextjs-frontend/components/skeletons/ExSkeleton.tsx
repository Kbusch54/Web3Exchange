'use client';
import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

interface Props {
    
}

const ExSkeleton: React.FC<Props> = () => {

        return (
            <Box
              sx={{
                bgcolor: '#121212',
                p: 8,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Skeleton
                sx={{ bgcolor: 'white' }}
                variant="rectangular"
                width={210}
                height={118}
              />
            </Box>
          );
    
}

export default ExSkeleton
