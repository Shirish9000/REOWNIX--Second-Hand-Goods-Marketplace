import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { Crown, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const PremiumMembershipBanner = () => {
  return (
    <Box sx={{ py: 10, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', position: 'relative', overflow: 'hidden' }}>
      
      {/* Decorative background elements */}
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0) 70%)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.2) 0%, rgba(37,99,235,0) 70%)', zIndex: 0 }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 1, bgcolor: 'rgba(255,215,0,0.1)', color: '#FFD700', borderRadius: '24px', mb: 3 }}>
                <Crown size={16} />
                <Typography variant="caption" fontWeight="bold" sx={{ letterSpacing: 1 }}>REOWN PREMIUM</Typography>
              </Box>
              <Typography variant="h3" fontWeight="900" sx={{ mb: 3, lineHeight: 1.2 }}>
                Unlock Unlimited <br/> Access & Views.
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, fontWeight: 400 }}>
                Upgrade to Premium and break free from the 10-product limit. Get exclusive early access to luxury items, reduced seller fees, and verified badges.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 5 }}>
                {['Unlimited Product Browsing', 'Priority Support & Authentication', '0% Seller Fees for 30 Days'].map((feature, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CheckCircle size={20} color="#10B981" />
                    <Typography variant="body1" fontWeight="500">{feature}</Typography>
                  </Box>
                ))}
              </Box>

              <Button 
                component={Link} 
                to="/premium"
                variant="contained" 
                sx={{ 
                  bgcolor: '#FFD700', color: '#0f172a', fontWeight: 800, px: 4, py: 1.5, borderRadius: '30px', fontSize: '1.1rem',
                  '&:hover': { bgcolor: '#FBBF24', transform: 'translateY(-2px)' },
                  transition: 'all 0.2s', boxShadow: '0 8px 25px rgba(255,215,0,0.3)'
                }}
              >
                View Premium Plans
              </Button>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <Box 
                component="img" 
                src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800" 
                alt="Premium Luxury"
                sx={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PremiumMembershipBanner;
