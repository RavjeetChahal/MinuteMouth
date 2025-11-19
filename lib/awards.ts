import { supabase } from './supabase';

export interface Award {
  name: string;
  description: string;
  emoji: string;
  permanent: boolean;
}

export const AWARDS: Record<string, Award> = {
  'inferno-king': {
    name: 'Inferno King',
    description: 'Most inferno posts this week',
    emoji: '👑🔥',
    permanent: true,
  },
  'mouth-of-madness': {
    name: 'Mouth of Madness',
    description: 'Highest total flames this week',
    emoji: '🎭',
    permanent: false,
  },
  'comedy-crime': {
    name: 'Comedy Crime',
    description: 'Funniest post (most super flames)',
    emoji: '😂',
    permanent: false,
  },
  'too-real': {
    name: 'Too Real Trophy',
    description: 'Most relatable post',
    emoji: '💯',
    permanent: false,
  },
  'campus-menace': {
    name: 'Campus Menace',
    description: 'Most chaotic poster',
    emoji: '😈',
    permanent: false,
  },
};

interface WeeklyStats {
  user_uuid: string;
  total_flames: number;
  total_super_flames: number;
  inferno_count: number;
  chaotic_count: number;
  post_count: number;
}

function getWeekNumber(date: Date = new Date()): number {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
}

export async function calculateWeeklyAwards(weekNumber?: number): Promise<void> {
  const week = weekNumber || getWeekNumber();
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  // Get all posts from the past week
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .gte('created_at', weekStart.toISOString());

  if (postsError || !posts) {
    console.error('Error fetching posts:', postsError);
    return;
  }

  // Calculate stats per user
  const userStats = new Map<string, WeeklyStats>();

  for (const post of posts) {
    if (!userStats.has(post.user_uuid)) {
      userStats.set(post.user_uuid, {
        user_uuid: post.user_uuid,
        total_flames: 0,
        total_super_flames: 0,
        inferno_count: 0,
        chaotic_count: 0,
        post_count: 0,
      });
    }

    const stats = userStats.get(post.user_uuid)!;
    stats.total_flames += post.flames || 0;
    stats.total_super_flames += post.super_flames || 0;
    stats.post_count += 1;

    if (post.heat_level === 'inferno') {
      stats.inferno_count += 1;
    } else if (post.heat_level === 'chaotic') {
      stats.chaotic_count += 1;
    }
  }

  const statsArray = Array.from(userStats.values());

  // Award 1: Inferno King (most inferno posts)
  const infernoKing = statsArray.reduce((prev, curr) =>
    curr.inferno_count > prev.inferno_count ? curr : prev
  );
  if (infernoKing.inferno_count > 0) {
    const topPost = posts
      .filter((p) => p.user_uuid === infernoKing.user_uuid && p.heat_level === 'inferno')
      .sort((a, b) => (b.flames + b.super_flames * 3) - (a.flames + a.super_flames * 3))[0];

    await saveAward(week, 'inferno-king', infernoKing.user_uuid, topPost.id);
    await addBadgeToUser(infernoKing.user_uuid, 'Inferno King 👑🔥');
  }

  // Award 2: Mouth of Madness (highest total flames)
  const mouthOfMadness = statsArray.reduce((prev, curr) =>
    curr.total_flames > prev.total_flames ? curr : prev
  );
  if (mouthOfMadness.total_flames > 0) {
    const topPost = posts
      .filter((p) => p.user_uuid === mouthOfMadness.user_uuid)
      .sort((a, b) => b.flames - a.flames)[0];

    await saveAward(week, 'mouth-of-madness', mouthOfMadness.user_uuid, topPost.id);
  }

  // Award 3: Comedy Crime (most super flames)
  const comedyCrime = statsArray.reduce((prev, curr) =>
    curr.total_super_flames > prev.total_super_flames ? curr : prev
  );
  if (comedyCrime.total_super_flames > 0) {
    const topPost = posts
      .filter((p) => p.user_uuid === comedyCrime.user_uuid)
      .sort((a, b) => b.super_flames - a.super_flames)[0];

    await saveAward(week, 'comedy-crime', comedyCrime.user_uuid, topPost.id);
  }

  // Award 4: Too Real Trophy (post with highest engagement ratio)
  const postsWithEngagement = posts.map((post) => ({
    ...post,
    engagement: (post.flames + post.super_flames * 3) / Math.max(1, post.flames + post.super_flames),
  }));
  const tooReal = postsWithEngagement.sort((a, b) => b.engagement - a.engagement)[0];
  if (tooReal) {
    await saveAward(week, 'too-real', tooReal.user_uuid, tooReal.id);
  }

  // Award 5: Campus Menace (most chaotic + inferno posts)
  const campusMenace = statsArray.reduce((prev, curr) => {
    const prevScore = prev.chaotic_count + prev.inferno_count;
    const currScore = curr.chaotic_count + curr.inferno_count;
    return currScore > prevScore ? curr : prev;
  });
  if (campusMenace.chaotic_count + campusMenace.inferno_count > 0) {
    const topPost = posts
      .filter((p) => p.user_uuid === campusMenace.user_uuid && (p.heat_level === 'chaotic' || p.heat_level === 'inferno'))
      .sort((a, b) => (b.flames + b.super_flames * 3) - (a.flames + a.super_flames * 3))[0];

    await saveAward(week, 'campus-menace', campusMenace.user_uuid, topPost.id);
  }

  console.log(`✅ Weekly awards calculated for week ${week}`);
}

async function saveAward(
  weekNumber: number,
  category: string,
  winnerUuid: string,
  postId: number
): Promise<void> {
  const { error } = await supabase
    .from('awards_weekly')
    .upsert({
      week_number: weekNumber,
      category,
      winner_uuid: winnerUuid,
      post_id: postId,
    }, {
      onConflict: 'week_number,category',
    });

  if (error) {
    console.error(`Error saving award ${category}:`, error);
  }
}

async function addBadgeToUser(uuid: string, badge: string): Promise<void> {
  const { data: user } = await supabase
    .from('users')
    .select('badges')
    .eq('uuid', uuid)
    .single();

  if (user) {
    const badges = user.badges || [];
    if (!badges.includes(badge)) {
      badges.push(badge);
      await supabase
        .from('users')
        .update({ badges })
        .eq('uuid', uuid);
    }
  }
}

export async function getWeeklyAwards(weekNumber?: number): Promise<any[]> {
  const week = weekNumber || getWeekNumber();

  const { data, error } = await supabase
    .from('awards_weekly')
    .select(`
      *,
      users!winner_uuid(alias, badges),
      posts!post_id(text, flames, super_flames, heat_level)
    `)
    .eq('week_number', week);

  if (error) {
    console.error('Error fetching awards:', error);
    return [];
  }

  return data || [];
}

