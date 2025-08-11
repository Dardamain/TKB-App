import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', logger(console.log));
app.use('*', cors({
  origin: ['*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['*'],
}));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// User signup
app.post('/make-server-aff34bda/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Initialize user data
    await kv.set(`user:${data.user.id}:balance`, 1234.56);
    await kv.set(`user:${data.user.id}:goal`, 5678.90);
    await kv.set(`user:${data.user.id}:trips`, []);

    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Get user profile and data
app.get('/make-server-aff34bda/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const balance = await kv.get(`user:${user.id}:balance`) || 1234.56;
    const goal = await kv.get(`user:${user.id}:goal`) || 5678.90;
    const trips = await kv.get(`user:${user.id}:trips`) || [];

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'User'
      },
      balance,
      goal,
      trips
    });
  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update user balance
app.put('/make-server-aff34bda/balance', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { balance } = await c.req.json();
    await kv.set(`user:${user.id}:balance`, balance);

    return c.json({ success: true, balance });
  } catch (error) {
    console.log('Balance update error:', error);
    return c.json({ error: 'Failed to update balance' }, 500);
  }
});

// Create a new trip
app.post('/make-server-aff34bda/trips', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const tripData = await c.req.json();
    const trips = await kv.get(`user:${user.id}:trips`) || [];
    
    const newTrip = {
      id: Date.now(),
      ...tripData,
      createdAt: new Date().toISOString(),
      progress: 0
    };

    trips.push(newTrip);
    await kv.set(`user:${user.id}:trips`, trips);

    return c.json({ trip: newTrip });
  } catch (error) {
    console.log('Trip creation error:', error);
    return c.json({ error: 'Failed to create trip' }, 500);
  }
});

// Update trip progress
app.put('/make-server-aff34bda/trips/:tripId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const tripId = parseInt(c.req.param('tripId'));
    const updateData = await c.req.json();
    const trips = await kv.get(`user:${user.id}:trips`) || [];
    
    const tripIndex = trips.findIndex(trip => trip.id === tripId);
    if (tripIndex === -1) {
      return c.json({ error: 'Trip not found' }, 404);
    }

    trips[tripIndex] = { ...trips[tripIndex], ...updateData };
    await kv.set(`user:${user.id}:trips`, trips);

    return c.json({ trip: trips[tripIndex] });
  } catch (error) {
    console.log('Trip update error:', error);
    return c.json({ error: 'Failed to update trip' }, 500);
  }
});

// Delete a trip
app.delete('/make-server-aff34bda/trips/:tripId', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const tripId = parseInt(c.req.param('tripId'));
    const trips = await kv.get(`user:${user.id}:trips`) || [];
    
    const filteredTrips = trips.filter(trip => trip.id !== tripId);
    await kv.set(`user:${user.id}:trips`, filteredTrips);

    return c.json({ success: true });
  } catch (error) {
    console.log('Trip deletion error:', error);
    return c.json({ error: 'Failed to delete trip' }, 500);
  }
});

Deno.serve(app.fetch);