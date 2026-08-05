import React from 'react';
import { Card, CardMedia, Box, Typography, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { Trophy, Users } from 'lucide-react';
import AuctionStatusBadge from './AuctionStatusBadge';
import Countdown from './Countdown';

const AuctionCard = ({ auction }) => {
  const {
    id,
    productTitle,
    productThumbnail,
    currentPrice,
    startingPrice,
    status,
    endTime,
    startTime,
    winnerName,
    bidCount = 0,
  } = auction || {};

  const isEnded = status === 'ENDED' || status === 'CANCELLED';
  const isLive = status === 'ACTIVE';
  const isUpcoming = status === 'UPCOMING' || status === 'PENDING';
  const hasBids = bidCount > 0;

  const imgUrl = productThumbnail
    ? (productThumbnail.startsWith('http') ? productThumbnail : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${productThumbnail}`)
    : null;

  return (
    <Card
      component={Link}
      to={`/auctions/${id}`}
      sx={{
        textDecoration: 'none',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: isLive ? '#86efac' : isUpcoming ? '#fde047' : 'divider',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isLive ? '0 0 0 2px rgba(34,197,94,0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.2s ease',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
        bgcolor: 'background.paper',
      }}
    >
      {/* Image */}
      <Box sx={{ height: 160, overflow: 'hidden', bgcolor: 'grey.100', position: 'relative' }}>
        {imgUrl ? (
          <CardMedia
            component="img"
            src={imgUrl}
            alt={productTitle}
            sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="text.disabled" fontSize="0.8rem">No Image</Typography>
          </Box>
        )}
        {/* Status badge overlay */}
        <Box sx={{ position: 'absolute', top: 8, left: 8 }}>
          <AuctionStatusBadge status={status} size="small" />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1 }}>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          sx={{ lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {productTitle || 'Untitled Auction'}
        </Typography>

        {/* LIVE state */}
        {isLive && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Current Bid</Typography>
                <Typography variant="h6" fontWeight={800} color="primary.main" lineHeight={1}>
                  ₹{Number(currentPrice || 0).toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">Ends in</Typography>
                <Typography variant="body2" fontWeight={700} color="error.main">
                  <Countdown endDate={endTime} />
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Users size={13} color="#6b7280" />
              <Typography variant="caption" color="text.secondary">{bidCount} bid{bidCount !== 1 ? 's' : ''}</Typography>
            </Box>
          </>
        )}

        {/* UPCOMING state */}
        {isUpcoming && (
          <Box>
            <Typography variant="caption" color="text.secondary">Starts in</Typography>
            <Typography variant="body2" fontWeight={700} color="warning.dark">
              <Countdown endDate={startTime} />
            </Typography>
            <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ mt: 0.5 }}>
              Starting: ₹{Number(startingPrice || currentPrice || 0).toLocaleString('en-IN')}
            </Typography>
          </Box>
        )}

        {/* ENDED state */}
        {isEnded && (
          <Box sx={{ mt: 'auto' }}>
            {hasBids ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Trophy size={14} color="#d97706" />
                  <Typography variant="caption" fontWeight={600} color="#d97706">
                    {winnerName || 'Winner'}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight={800} color="text.primary">
                  ₹{Number(currentPrice || 0).toLocaleString('en-IN')}
                </Typography>
                <Typography variant="caption" color="text.secondary">{bidCount} bid{bidCount !== 1 ? 's' : ''}</Typography>
              </>
            ) : (
              <Typography variant="caption" color="text.secondary" fontStyle="italic">
                No bids were placed
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default AuctionCard;
