import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Divider, Chip } from '@mui/material';
import { Gavel, Trophy } from 'lucide-react';

const formatTime = (dt) => {
  if (!dt) return '';
  return new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const BidHistory = ({ bids = [], isEnded = false }) => {
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [bids.length]);

  // Sort: highest amount first (backend already does this, but ensure)
  const sorted = [...bids].sort((a, b) => Number(b.amount) - Number(a.amount));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Gavel size={20} color="#2563EB" />
        <Typography variant="h6" fontWeight={700}>Bid History</Typography>
        <Chip label={`${bids.length} bid${bids.length !== 1 ? 's' : ''}`} size="small" sx={{ ml: 'auto', bgcolor: '#eff6ff', color: '#2563EB', fontWeight: 600 }} />
      </Box>
      <Divider sx={{ mb: 2 }} />

      {sorted.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" fontSize="0.9rem">No bids yet. Be the first!</Typography>
        </Box>
      ) : (
        <Box sx={{ maxHeight: 380, overflowY: 'auto', pr: 0.5, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#e5e7eb', borderRadius: 4 } }}>
          <div ref={topRef} />
          {sorted.map((bid, index) => {
            const isWinning = index === 0 && isEnded;
            // Handle both REST response (bidderName) and WS broadcast (bidderName) fields
            const name = bid.bidderName || bid.name || 'Unknown';
            const amount = bid.amount || bid.bidAmount || 0;
            const time = bid.bidTime || bid.timestamp;

            return (
              <Box
                key={bid.id || `${amount}-${time}-${index}`}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  px: 2,
                  mb: 1,
                  borderRadius: 2,
                  bgcolor: isWinning ? '#fefce8' : index === 0 ? '#eff6ff' : 'grey.50',
                  border: '1px solid',
                  borderColor: isWinning ? '#fde047' : index === 0 ? '#bfdbfe' : '#f3f4f6',
                  transition: 'all 0.2s',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {isWinning && <Trophy size={15} color="#d97706" />}
                  <Box>
                    <Typography variant="body2" fontWeight={700} color={isWinning ? '#a16207' : index === 0 ? 'primary.main' : 'text.primary'}>
                      ₹{Number(amount).toLocaleString('en-IN')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{name}</Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  {isWinning && (
                    <Chip label="Winning Bid" size="small" sx={{ mb: 0.25, bgcolor: '#fef9c3', color: '#a16207', fontWeight: 700, fontSize: '0.65rem', height: 18 }} />
                  )}
                  <Typography variant="caption" color="text.disabled" display="block">
                    {formatTime(time)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default BidHistory;
