// src/components/StatsCards.jsx
import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';

/**
 * Displays a set of statistic cards in a responsive grid.
 * `stats` is an object with numeric values for each metric.
 */
const StatsCards = ({ stats }) => {
  const safeStats = stats ?? {};

  const items = [
    { title: 'Products', value: safeStats?.products || 0 },
    { title: 'Active Listings', value: safeStats?.activeListings || 0 },
    { title: 'Sold', value: safeStats?.sold || 0 },
    { title: 'Offers', value: safeStats?.offers || 0 },
    { title: 'Auctions', value: safeStats?.auctions || 0 },
    { title: 'Wishlist Saves', value: safeStats?.wishlist || 0 },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item key={item.title} xs={12} sm={6} md={4} lg={2}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h5" fontWeight="bold">
                {item.value}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {item.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatsCards;