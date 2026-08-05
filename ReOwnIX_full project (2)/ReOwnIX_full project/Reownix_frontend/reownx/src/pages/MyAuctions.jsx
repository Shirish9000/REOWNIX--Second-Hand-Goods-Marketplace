import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, Grid, CircularProgress } from '@mui/material';
import auctionApi from '../services/auctionApi';
import productApi from '../services/productApi';
import { useAuth } from '../context/AuthContext';
import AuctionCard from '../components/auction/AuctionCard';

const MyAuctions = () => {
  const { user } = useAuth();
  const [subTab, setSubTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [myBidAuctions, setMyBidAuctions] = useState([]);
  const [myCreatedAuctions, setMyCreatedAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        // 1. Fetch auctions the user has bid on
        const bids = await auctionApi.getMyBids().catch(() => []);
        const uniqueAuctionIds = [...new Set(bids.map(b => b.auctionId))];
        
        const bidAuctionsPromises = uniqueAuctionIds.map(id => 
          auctionApi.getAuctionDetails(id).catch(() => null)
        );
        const bidAuctionsResults = await Promise.all(bidAuctionsPromises);
        const validBidAuctions = bidAuctionsResults.filter(Boolean);
        setMyBidAuctions(validBidAuctions);

        // 2. Fetch auctions the user created
        const myProducts = await productApi.getMyProducts().catch(() => []);
        const createdAuctionsPromises = myProducts.map(p => 
          auctionApi.getAuctionByProductId(p.id).catch(() => null)
        );
        const createdAuctionsResults = await Promise.all(createdAuctionsPromises);
        const validCreatedAuctions = createdAuctionsResults.filter(Boolean);
        setMyCreatedAuctions(validCreatedAuctions);

      } catch (err) {
        console.error("Failed to load user auctions", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchAuctions();
    }
  }, [user]);

  // Categorize bid auctions
  const liveAuctions = myBidAuctions.filter(a => a.status === 'ACTIVE');
  const upcomingAuctions = myBidAuctions.filter(a => a.status === 'UPCOMING');
  
  const wonAuctions = myBidAuctions.filter(a => {
    const isEnded = a.status === 'ENDED';
    const isWinner = String(a.winnerId || (a.winner && a.winner.id)) === String(user?.userId);
    return isEnded && isWinner;
  });
  
  const lostAuctions = myBidAuctions.filter(a => {
    const isEnded = a.status === 'ENDED';
    const isWinner = String(a.winnerId || (a.winner && a.winner.id)) === String(user?.userId);
    return isEnded && !isWinner;
  });
  
  const endedAuctions = myBidAuctions.filter(a => a.status === 'ENDED' || a.status === 'CANCELLED');

  const getFilteredAuctions = () => {
    switch (subTab) {
      case 0: return liveAuctions;
      case 1: return upcomingAuctions;
      case 2: return wonAuctions;
      case 3: return lostAuctions;
      case 4: return endedAuctions;
      case 5: return myCreatedAuctions;
      default: return [];
    }
  };

  const currentAuctions = getFilteredAuctions();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>My Auctions</Typography>
      </Box>
      <Tabs
        value={subTab}
        onChange={(e, v) => setSubTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={`Live (${liveAuctions.length})`} />
        <Tab label={`Upcoming (${upcomingAuctions.length})`} />
        <Tab label={`Won (${wonAuctions.length})`} />
        <Tab label={`Lost (${lostAuctions.length})`} />
        <Tab label={`All Ended (${endedAuctions.length})`} />
        <Tab label={`Created by Me (${myCreatedAuctions.length})`} />
      </Tabs>

      {currentAuctions.length === 0 ? (
        <Box sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }}>
          <Typography variant="h6" color="text.secondary" fontWeight="bold">
            No auctions found in this category.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: 3, 
          alignItems: 'start' 
        }}>
          {currentAuctions.map(auction => (
            <Box key={auction.id} sx={{ height: '100%' }}>
              <AuctionCard auction={auction} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyAuctions;
