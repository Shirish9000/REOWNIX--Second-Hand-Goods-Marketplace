import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { TrendingUp, Users, Clock, Gavel, UserCheck } from 'lucide-react';
import Countdown from './Countdown';

const StatBox = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
    <Box sx={{ p: 1.5, bgcolor: 'primary.light', color: 'primary.main', borderRadius: 2, display: 'flex' }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight="bold">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  </Box>
);

const LiveStatistics = ({ auction, bids }) => {
  if (!auction) return null;

  // Calculate unique participants
  const uniqueParticipants = new Set(bids.map(b => b.bidderId || (b.bidder && b.bidder.id))).size;
  const highestBidderName = bids.length > 0 ? (bids[0].bidderName || (bids[0].bidder ? `${bids[0].bidder.firstName} ${bids[0].bidder.lastName}` : 'Anonymous')) : 'No bids yet';

  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 4, mt: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUp size={20} /> Live Statistics
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <StatBox 
            icon={<Gavel size={20} />} 
            label="Total Bids" 
            value={bids.length} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatBox 
            icon={<Users size={20} />} 
            label="Participants" 
            value={uniqueParticipants} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatBox 
            icon={<UserCheck size={20} />} 
            label="Highest Bidder" 
            value={highestBidderName} 
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatBox 
            icon={<Clock size={20} />} 
            label="Time Remaining" 
            value={<Countdown endTime={auction.endTime} status={auction.status} />} 
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LiveStatistics;
