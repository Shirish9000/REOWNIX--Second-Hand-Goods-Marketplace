import React, { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import { Gavel } from 'lucide-react';

const BidInput = ({ disabled, disabledReason, currentPrice, minIncrement, onPlaceBid }) => {
  const minBid = Number(currentPrice || 0) + Number(minIncrement || 1);
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const val = Number(amount);
    if (!val || val < minBid) return;
    onPlaceBid(val);
    setAmount('');
  };

  if (disabled) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          disabled
          startIcon={<Gavel size={18} />}
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '1rem' }}
        >
          {disabledReason || 'Auction Closed'}
        </Button>
        {disabledReason && (
          <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
            {disabledReason}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <TextField
        fullWidth
        type="number"
        label="Your Bid (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={`Min ₹${minBid.toLocaleString('en-IN')}`}
        InputProps={{
          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
          inputProps: { min: minBid },
        }}
        variant="outlined"
        size="small"
      />
      <Typography variant="caption" color="text.secondary">
        Minimum bid: ₹{minBid.toLocaleString('en-IN')}
      </Typography>
      <Button
        variant="contained"
        fullWidth
        size="large"
        disabled={!amount || Number(amount) < minBid}
        onClick={handleSubmit}
        startIcon={<Gavel size={18} />}
        sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '1rem', textTransform: 'none' }}
      >
        Place Bid
      </Button>
    </Box>
  );
};

export default BidInput;
