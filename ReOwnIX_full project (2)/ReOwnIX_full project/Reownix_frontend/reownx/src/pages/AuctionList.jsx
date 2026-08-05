import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Container } from '@mui/material';
import auctionApi from '../services/auctionApi';
import AuctionCard from '../components/auction/AuctionCard';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await auctionApi.getActiveAuctions();
        setAuctions(data || []);
      } catch (err) {
        console.error('Failed to fetch active auctions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4 }}>
        Live Auctions
      </Typography>
      {auctions.length === 0 ? (
        <Typography color="text.secondary">No live auctions available right now.</Typography>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: 4, 
          alignItems: 'start' 
        }}>
          {auctions.map((auction) => (
            <Box key={auction.id} sx={{ height: '100%' }}>
              <AuctionCard auction={auction} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default AuctionList;
