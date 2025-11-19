// Supabase Edge Function for calculating weekly awards
// Deploy with: supabase functions deploy weekly-awards
// Schedule with: Supabase Dashboard > Database > Cron Jobs

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify this is a valid request (could add auth header check)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.includes('Bearer')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Calculate week number
    const today = new Date();
    const oneJan = new Date(today.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((today.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((today.getDay() + 1 + numberOfDays) / 7);

    // Get posts from the past week
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .gte('created_at', weekStart.toISOString());

    if (postsError) {
      throw postsError;
    }

    // Calculate user stats
    const userStats = new Map();
    for (const post of posts) {
      if (!userStats.has(post.user_uuid)) {
        userStats.set(post.user_uuid, {
          user_uuid: post.user_uuid,
          total_flames: 0,
          total_super_flames: 0,
          inferno_count: 0,
          chaotic_count: 0,
        });
      }
      const stats = userStats.get(post.user_uuid);
      stats.total_flames += post.flames || 0;
      stats.total_super_flames += post.super_flames || 0;
      if (post.heat_level === 'inferno') stats.inferno_count += 1;
      if (post.heat_level === 'chaotic') stats.chaotic_count += 1;
    }

    const statsArray = Array.from(userStats.values());

    // Award winners
    const awards = [];

    // Inferno King
    const infernoKing = statsArray.reduce((prev, curr) =>
      curr.inferno_count > prev.inferno_count ? curr : prev
    );
    if (infernoKing.inferno_count > 0) {
      const topPost = posts
        .filter((p) => p.user_uuid === infernoKing.user_uuid && p.heat_level === 'inferno')
        .sort((a, b) => (b.flames + b.super_flames * 3) - (a.flames + a.super_flames * 3))[0];
      
      awards.push({
        week_number: weekNumber,
        category: 'inferno-king',
        winner_uuid: infernoKing.user_uuid,
        post_id: topPost.id,
      });

      // Add permanent badge
      const { data: user } = await supabase
        .from('users')
        .select('badges')
        .eq('uuid', infernoKing.user_uuid)
        .single();
      
      if (user) {
        const badges = user.badges || [];
        if (!badges.includes('Inferno King 👑🔥')) {
          badges.push('Inferno King 👑🔥');
          await supabase
            .from('users')
            .update({ badges })
            .eq('uuid', infernoKing.user_uuid);
        }
      }
    }

    // Mouth of Madness
    const mouthOfMadness = statsArray.reduce((prev, curr) =>
      curr.total_flames > prev.total_flames ? curr : prev
    );
    if (mouthOfMadness.total_flames > 0) {
      const topPost = posts
        .filter((p) => p.user_uuid === mouthOfMadness.user_uuid)
        .sort((a, b) => b.flames - a.flames)[0];
      
      awards.push({
        week_number: weekNumber,
        category: 'mouth-of-madness',
        winner_uuid: mouthOfMadness.user_uuid,
        post_id: topPost.id,
      });
    }

    // Comedy Crime
    const comedyCrime = statsArray.reduce((prev, curr) =>
      curr.total_super_flames > prev.total_super_flames ? curr : prev
    );
    if (comedyCrime.total_super_flames > 0) {
      const topPost = posts
        .filter((p) => p.user_uuid === comedyCrime.user_uuid)
        .sort((a, b) => b.super_flames - a.super_flames)[0];
      
      awards.push({
        week_number: weekNumber,
        category: 'comedy-crime',
        winner_uuid: comedyCrime.user_uuid,
        post_id: topPost.id,
      });
    }

    // Campus Menace
    const campusMenace = statsArray.reduce((prev, curr) => {
      const prevScore = prev.chaotic_count + prev.inferno_count;
      const currScore = curr.chaotic_count + curr.inferno_count;
      return currScore > prevScore ? curr : prev;
    });
    if (campusMenace.chaotic_count + campusMenace.inferno_count > 0) {
      const topPost = posts
        .filter((p) => p.user_uuid === campusMenace.user_uuid && 
                      (p.heat_level === 'chaotic' || p.heat_level === 'inferno'))
        .sort((a, b) => (b.flames + b.super_flames * 3) - (a.flames + a.super_flames * 3))[0];
      
      awards.push({
        week_number: weekNumber,
        category: 'campus-menace',
        winner_uuid: campusMenace.user_uuid,
        post_id: topPost.id,
      });
    }

    // Save all awards
    if (awards.length > 0) {
      const { error: awardsError } = await supabase
        .from('awards_weekly')
        .upsert(awards, { onConflict: 'week_number,category' });

      if (awardsError) {
        throw awardsError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        week: weekNumber,
        awards: awards.length,
        message: `Calculated ${awards.length} awards for week ${weekNumber}`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

