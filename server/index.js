require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const admin = require('firebase-admin');

const app = express();
app.use(express.json());
app.use(cors({ origin: (origin, cb) => cb(null, true) }));

// ── Firestore ─────────────────────────────────────────────────────────────────

if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : require('./serviceAccount.json');
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}
const db = admin.firestore();

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'topdawg-os' }));

// ── Meta OAuth ────────────────────────────────────────────────────────────────

app.get('/auth/social/meta/connect', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.META_APP_ID,
    redirect_uri: 'https://topdawg-os.onrender.com/auth/social/meta/callback',
    scope: 'pages_show_list,pages_read_engagement,pages_read_user_content,read_insights,instagram_manage_insights,public_profile',
    response_type: 'code',
  });
  res.redirect(`https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`);
});

app.get('/auth/social/meta/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const redirectUri = 'https://topdawg-os.onrender.com/auth/social/meta/callback';

    // Step 1 — exchange code for short-lived token
    const shortRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&code=${encodeURIComponent(code)}&redirect_uri=${encodeURIComponent(redirectUri)}`
    );
    const shortData = await shortRes.json();
    if (shortData.error) throw new Error(shortData.error.message || JSON.stringify(shortData.error));
    const short_lived_token = shortData.access_token;

    // Step 2 — exchange for long-lived token (60 days)
    const longRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${encodeURIComponent(short_lived_token)}`
    );
    const longData = await longRes.json();
    if (longData.error) throw new Error(longData.error.message || JSON.stringify(longData.error));
    const expiry_date = Date.now() + ((longData.expires_in || 5184000) * 1000);
    const user_access_token = longData.access_token;

    // Step 3 — resolve page token and IG account at auth time
    let page_id = process.env.META_PAGE_ID || null;
    let page_access_token = null;
    let ig_account_id = null;

    try {
      const pagesRes = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=${user_access_token}`
      );
      const pagesData = await pagesRes.json();
      const pages = pagesData.data || [];
      const page = pages.find(p => p.id === process.env.META_PAGE_ID) || pages[0];
      if (page) { page_id = page.id; page_access_token = page.access_token; }
    } catch (_) {}

    // Business Manager fallback — direct page fetch
    if (!page_access_token && page_id) {
      try {
        const directRes = await fetch(
          `https://graph.facebook.com/v21.0/${page_id}?fields=id,name,access_token&access_token=${user_access_token}`
        );
        const directData = await directRes.json();
        if (!directData.error && directData.access_token) page_access_token = directData.access_token;
      } catch (_) {}
    }

    // Step 4 — resolve IG account ID
    if (page_id && page_access_token) {
      try {
        const igRes = await fetch(
          `https://graph.facebook.com/v21.0/${page_id}?fields=instagram_business_account,connected_instagram_account&access_token=${page_access_token}`
        );
        const igData = await igRes.json();
        const igRef = igData.instagram_business_account || igData.connected_instagram_account;
        if (igRef?.id) ig_account_id = igRef.id;
      } catch (_) {}
    }

    await db.collection('td_config').doc('social_tokens_meta').set({
      user_access_token,
      expiry_date,
      ...(page_id           && { page_id }),
      ...(page_access_token && { page_access_token }),
      ...(ig_account_id     && { ig_account_id }),
    });
    res.redirect('https://topdawg-os.web.app/social?connected=meta');
  } catch (e) {
    console.error('Meta social auth error:', e.message);
    res.redirect('https://topdawg-os.web.app/social?error=meta_auth_failed');
  }
});

// ── Social status ─────────────────────────────────────────────────────────────

app.get('/auth/social/status', async (req, res) => {
  try {
    const metaDoc = await db.collection('td_config').doc('social_tokens_meta').get();
    res.json({ meta: metaDoc.exists && !!metaDoc.data()?.user_access_token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Social metrics ────────────────────────────────────────────────────────────

app.get('/api/social/metrics', async (req, res) => {
  try {
    const metaDoc = await db.collection('td_config').doc('social_tokens_meta').get();
    let metaResult = { connected: false };

    if (metaDoc.exists && metaDoc.data()?.user_access_token) {
      try {
        const stored = metaDoc.data();
        const { user_access_token } = stored;

        let pageId = stored.page_id || process.env.META_PAGE_ID || null;
        let page_access_token = stored.page_access_token || null;

        if (!page_access_token) {
          const pagesRes = await fetch(
            `https://graph.facebook.com/v21.0/me/accounts?access_token=${user_access_token}&fields=id,name,access_token`
          );
          const pagesData = await pagesRes.json();
          const pages = pagesData.data || [];
          let page = pages.find(p => p.id === process.env.META_PAGE_ID) || pages[0];
          if (!page && process.env.META_PAGE_ID) {
            const directRes = await fetch(
              `https://graph.facebook.com/v21.0/${process.env.META_PAGE_ID}?fields=id,name,access_token&access_token=${user_access_token}`
            );
            const directData = await directRes.json();
            if (!directData.error && directData.access_token) page = directData;
          }
          if (!page) throw new Error('No matching page found');
          pageId = pageId || page.id;
          page_access_token = page.access_token;
        }
        if (!page_access_token) throw new Error('No page access token');

        // Resolve IG account ID
        let igAccountId = stored.ig_account_id || null;
        if (!igAccountId) {
          const igRes = await fetch(
            `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account,connected_instagram_account&access_token=${page_access_token}`
          );
          const igData = await igRes.json();
          const igRef = igData.instagram_business_account || igData.connected_instagram_account;
          igAccountId = igRef?.id || null;
        }

        // IG profile
        let igAccount = null;
        if (igAccountId) {
          try {
            const igProfileRes = await fetch(
              `https://graph.facebook.com/v21.0/${igAccountId}?fields=id,username,followers_count,media_count&access_token=${page_access_token}`
            );
            const igProfileData = await igProfileRes.json();
            if (!igProfileData.error) igAccount = igProfileData;
          } catch (_) {}
        }

        // IG posts (9 most recent)
        let igPosts = [], igAvgLikes = null, igAvgComments = null, igEngagementRate = null;
        if (igAccount?.id) {
          try {
            const mediaRes = await fetch(
              `https://graph.facebook.com/v21.0/${igAccount.id}/media?fields=id,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count,caption,permalink&limit=9&access_token=${page_access_token}`
            );
            const mediaData = await mediaRes.json();
            if (!mediaData.error && mediaData.data?.length) {
              igPosts = mediaData.data.map(p => ({
                id: p.id,
                mediaType: p.media_type,
                mediaUrl: p.media_url || p.thumbnail_url || null,
                thumbnailUrl: p.thumbnail_url || p.media_url || null,
                timestamp: p.timestamp,
                likes: p.like_count || 0,
                comments: p.comments_count || 0,
                caption: p.caption || null,
                permalink: p.permalink || null,
              }));
              const totalLikes = igPosts.reduce((s, p) => s + p.likes, 0);
              const totalComments = igPosts.reduce((s, p) => s + p.comments, 0);
              igAvgLikes = Math.round(totalLikes / igPosts.length);
              igAvgComments = Math.round(totalComments / igPosts.length);
              if (igAccount.followers_count > 0) {
                igEngagementRate = parseFloat(
                  (((totalLikes + totalComments) / igPosts.length / igAccount.followers_count) * 100).toFixed(2)
                );
              }
            }
          } catch (_) {}
        }

        // FB posts
        let fbPosts = [];
        try {
          const fbPostsRes = await fetch(
            `https://graph.facebook.com/v21.0/${pageId}/feed?fields=id,message,full_picture,created_time,permalink_url,likes.summary(true),comments.summary(true),shares&limit=9&access_token=${page_access_token}`
          );
          const fbPostsData = await fbPostsRes.json();
          if (!fbPostsData.error && fbPostsData.data?.length) {
            fbPosts = fbPostsData.data.map(p => ({
              id: p.id,
              message: p.message || null,
              imageUrl: p.full_picture || null,
              timestamp: p.created_time,
              likes: p.likes?.summary?.total_count ?? 0,
              comments: p.comments?.summary?.total_count ?? 0,
              shares: p.shares?.count ?? 0,
              permalink: p.permalink_url || null,
            }));
          }
        } catch (_) {}

        // Date range for insights
        const range = parseInt(req.query.range) || 28;
        const untilDate = new Date();
        untilDate.setUTCHours(7, 0, 0, 0);
        if (untilDate.getTime() > Date.now()) untilDate.setUTCDate(untilDate.getUTCDate() - 1);
        const untilBoundary = Math.floor(untilDate.getTime() / 1000);
        const until     = untilBoundary - 1;
        const since     = untilBoundary - (range * 24 * 60 * 60);
        const prevSince = since - (range * 24 * 60 * 60);

        // IG insights (chunked to respect 30d limit)
        const fetchIgChunked = async (metric, s, u) => {
          const CHUNK = 30 * 86400;
          const chunks = [];
          for (let cs = s; cs < u; cs += CHUNK) chunks.push([cs, Math.min(cs + CHUNK, u)]);
          const results = await Promise.all(
            chunks.map(([cs, cu]) =>
              fetch(`https://graph.facebook.com/v21.0/${igAccountId}/insights?metric=${metric}&period=day&since=${cs}&until=${cu}&access_token=${page_access_token}`)
                .then(r => r.json())
            )
          );
          if (results.some(r => r.error)) return null;
          const merged = {};
          for (const res of results) {
            for (const item of (res.data || [])) {
              if (!merged[item.name]) merged[item.name] = { name: item.name, values: [] };
              merged[item.name].values.push(...(item.values || []));
            }
          }
          return Object.values(merged);
        };

        const fetchIgTotal = async (metrics, s, u) => {
          const CHUNK = 30 * 86400;
          const chunks = [];
          for (let cs = s; cs < u; cs += CHUNK) chunks.push([cs, Math.min(cs + CHUNK, u)]);
          const results = await Promise.all(
            chunks.map(([cs, cu]) =>
              fetch(`https://graph.facebook.com/v21.0/${igAccountId}/insights?metric=${metrics}&metric_type=total_value&period=day&since=${cs}&until=${cu}&access_token=${page_access_token}`)
                .then(r => r.json())
            )
          );
          if (results.some(r => r.error)) return null;
          const totals = {};
          for (const res of results) {
            for (const item of (res.data || [])) {
              if (item?.name) totals[item.name] = (totals[item.name] || 0) + (item.total_value?.value || 0);
            }
          }
          return totals;
        };

        let igReach = null, igReachChange = null, igDailyReach = [],
            igContentViews = null, igProfileViews = null,
            igLikes = null, igSaves = null, igTotalInteractions = null;
        if (igAccountId) {
          try {
            const [igData, igPrevData, igTotals] = await Promise.all([
              fetchIgChunked('reach', since, until),
              fetchIgChunked('reach', prevSince, since),
              fetchIgTotal('views,likes,saves,profile_views,total_interactions', since, until).catch(() => null),
            ]);
            if (igData) {
              const sumSeries = (data, name) => {
                const s = data.find(d => d.name === name);
                return s ? s.values.reduce((a, v) => a + (v.value || 0), 0) : null;
              };
              igReach = sumSeries(igData, 'reach');
              const reachSeries = igData.find(d => d.name === 'reach');
              if (reachSeries?.values) {
                igDailyReach = reachSeries.values.map(v => {
                  const d = new Date(v.end_time);
                  d.setUTCDate(d.getUTCDate() - 1);
                  return { date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value: v.value || 0 };
                });
              }
              if (igPrevData) {
                const prevS = igPrevData.find(d => d.name === 'reach');
                const prevReach = prevS ? prevS.values.reduce((a, v) => a + (v.value || 0), 0) : 0;
                if (prevReach > 0 && igReach != null) igReachChange = Math.round(((igReach - prevReach) / prevReach) * 100);
              }
            }
            if (igTotals) {
              igContentViews      = igTotals.views ?? null;
              igProfileViews      = igTotals.profile_views ?? null;
              igLikes             = igTotals.likes ?? null;
              igSaves             = igTotals.saves ?? null;
              igTotalInteractions = igTotals.total_interactions ?? null;
            }
          } catch (_) {}
        }

        // FB page insights
        let pageViews = 0, prevPageViews = 0, reach = 0, engagement = 0,
            reactions = 0, dailyFollows = 0, followsTotal = null, pageName = null,
            dailyPageViews = [], insightsError = null;

        // Fetch page name + fan_count
        try {
          const pageInfoRes = await fetch(
            `https://graph.facebook.com/v21.0/${pageId}?fields=name,fan_count&access_token=${page_access_token}`
          );
          const pageInfo = await pageInfoRes.json();
          if (!pageInfo.error) { pageName = pageInfo.name; followsTotal = pageInfo.fan_count ?? null; }
        } catch (_) {}

        // page_follows for more accurate follower count
        try {
          const fRes = await fetch(
            `https://graph.facebook.com/v21.0/${pageId}/insights?metric=page_follows&period=day&access_token=${page_access_token}`
          );
          const fData = await fRes.json();
          if (!fData.error && fData.data?.[0]?.values?.length) {
            const vals = fData.data[0].values;
            const last = vals[vals.length - 1];
            if (last && Number(last.value) > 0) followsTotal = Number(last.value);
          }
        } catch (_) {}

        const insParams = new URLSearchParams({
          metric: [
            'page_views_total','page_posts_impressions','page_impressions_unique',
            'page_video_views','page_post_engagements',
            'page_actions_post_reactions_total','page_daily_follows',
          ].join(','),
          period: 'day', since, until,
          access_token: page_access_token,
        });
        const prevParams = new URLSearchParams({
          metric: 'page_views_total,page_posts_impressions',
          period: 'day', since: prevSince, until: since,
          access_token: page_access_token,
        });

        try {
          const [insRes, prevRes] = await Promise.all([
            fetch(`https://graph.facebook.com/v21.0/${pageId}/insights?${insParams}`),
            fetch(`https://graph.facebook.com/v21.0/${pageId}/insights?${prevParams}`),
          ]);
          const [insData, prevData] = await Promise.all([insRes.json(), prevRes.json()]);

          if (insData.error) {
            insightsError = `Insights: ${insData.error.message} (code ${insData.error.code})`;
          } else {
            const sumSeries = (data, name) => {
              const s = data.data?.find(d => d.name === name);
              return (s?.values || []).reduce((sum, v) => {
                const val = v.value;
                if (val && typeof val === 'object') return sum + Object.values(val).reduce((a, b) => a + b, 0);
                return sum + (Number(val) || 0);
              }, 0);
            };
            pageViews  = sumSeries(insData, 'page_views_total') + sumSeries(insData, 'page_posts_impressions');
            reach      = sumSeries(insData, 'page_impressions_unique');
            engagement = sumSeries(insData, 'page_post_engagements');
            reactions  = sumSeries(insData, 'page_actions_post_reactions_total');
            dailyFollows = sumSeries(insData, 'page_daily_follows');
            if (!prevData.error) prevPageViews = sumSeries(prevData, 'page_views_total') + sumSeries(prevData, 'page_posts_impressions');

            const fbDate = et => {
              const d = new Date(et);
              d.setUTCDate(d.getUTCDate() - 1);
              return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            };
            const dayMap = {};
            const getSeries = name => insData.data?.find(d => d.name === name)?.values || [];
            getSeries('page_views_total').forEach(v => { const d = fbDate(v.end_time); dayMap[d] = (dayMap[d] || 0) + (Number(v.value) || 0); });
            getSeries('page_posts_impressions').forEach(v => { const d = fbDate(v.end_time); dayMap[d] = (dayMap[d] || 0) + (Number(v.value) || 0); });
            dailyPageViews = Object.entries(dayMap).map(([date, value]) => ({ date, value }));
          }
        } catch (e) { insightsError = e.message; }

        const viewsChange = prevPageViews > 0
          ? Math.round(((pageViews - prevPageViews) / prevPageViews) * 100)
          : null;

        metaResult = {
          connected: true,
          pageName,
          followsTotal,
          pageViews, viewsChange, prevPageViews,
          reach, engagement, reactions, dailyFollows,
          dailyPageViews,
          fbPosts,
          igAccount,
          igPosts,
          igAvgLikes, igAvgComments, igEngagementRate,
          igReach, igReachChange, igDailyReach,
          igContentViews, igProfileViews, igLikes, igSaves, igTotalInteractions,
          ...(insightsError && { insightsError }),
        };
      } catch (e) {
        metaResult = { connected: true, error: e.message };
      }
    }

    res.json({ meta: metaResult });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Top Dawg OS server on port ${PORT}`));
