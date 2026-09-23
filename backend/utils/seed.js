/**
 * Seeds a real MongoDB database with the same demo dataset used by the
 * in-memory mock store, so `npm run seed` gives you a populated
 * database to develop against once MONGO_URI points at a live instance.
 *
 * Usage: npm run seed
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Circle from '../models/Circle.js';

const DEMO_PASSWORD = 'Feedants@123';

const seedUsers = [
  {
    name: 'Sarah Lin',
    username: 'sarahlin',
    email: 'sarah@feedants.dev',
    password: DEMO_PASSWORD,
    role: 'staff',
    title: 'Staff Engineer & Tech Creator @ CloudScale',
    company: 'CloudScale',
    location: 'San Francisco, CA',
    bio: 'I write about distributed systems, Rust, and the occasional WebAssembly rabbit hole. Previously @Stripe, @HashiCorp. Building in public.',
    techStack: ['Rust', 'TypeScript', 'Go', 'Kubernetes', 'WebAssembly'],
    verified: true,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeO9avLtUd3-vEB5n5IKd5MsVDQYDm7RnbBRyWbYNSIzi4I8fU2a8tEnMnr8RS1YLl63VWi5CAcaaZqu84FrSk-rytkgRcOL5hPFLnLVg92F6moC4WXSN_y1L189Mx-sVwcumS2ps2i6eEqNVWdhp24VYRvSpF7nPit52vRMYsggk5jgxq2eUWRqyuUuSRSRXkaU2OQw8uX0DkfZks7gcE0SCwX4wDx9iX8jjo9J1aCkyHPUJIDWM',
  },
  {
    name: 'Alex Rivera',
    username: 'alexrivera',
    email: 'alex@feedants.dev',
    password: DEMO_PASSWORD,
    role: 'creator',
    title: 'Principal Engineer @ Latencia',
    company: 'Latencia',
    location: 'Austin, TX',
    bio: 'Systems programmer obsessed with zero-copy everything. Rust & WebTransport enthusiast.',
    techStack: ['Rust', 'C++', 'QUIC', 'WebTransport'],
    verified: true,
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Elena Rostova',
    username: 'elenarostova',
    email: 'elena@feedants.dev',
    password: DEMO_PASSWORD,
    role: 'creator',
    title: 'Founder @ CanvasUI',
    company: 'CanvasUI',
    location: 'Berlin, DE',
    bio: 'Building CanvasUI — a design-to-code engine for product teams. Ex-Figma.',
    techStack: ['TypeScript', 'React', 'WebGL', 'Design Systems'],
    verified: true,
    avatar: 'https://i.pravatar.cc/150?img=45',
  },
  {
    name: 'Marcus Cho',
    username: 'marcuscho',
    email: 'marcus@feedants.dev',
    password: DEMO_PASSWORD,
    role: 'member',
    title: 'Backend Engineer @ Meridian',
    company: 'Meridian',
    location: 'Toronto, CA',
    bio: 'Distributed consensus, Raft, and coffee.',
    techStack: ['Go', 'Raft', 'PostgreSQL'],
    verified: false,
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
];

const seedCircles = [
  { name: 'TypeScript Community', description: 'Everything TypeScript — types, tooling, and stricter configs.', category: 'Frontend Architecture', icon: 'code', color: '#3178c6', postCount: 128 },
  { name: 'Rust & Systems', description: 'Low-level systems programming, memory safety, and performance engineering.', category: 'Low-Latency & WASM', icon: 'memory', color: '#ce422b', postCount: 96 },
  { name: 'AI & Autonomous Agents', description: 'Agentic architectures, LLM tooling, and infrastructure for autonomous systems.', category: 'AI & Infra', icon: 'smart_toy', color: '#7c3aed', postCount: 214 },
  { name: 'Large Scale System Design', description: 'Architecture reviews, scaling stories, and distributed systems trade-offs.', category: 'Systems & Backend', icon: 'hub', color: '#059669', postCount: 173 },
  { name: 'Open Source Founders', description: 'For maintainers and founders building sustainable open-source companies.', category: 'Open Source', icon: 'diversity_3', color: '#f59e0b', postCount: 61 },
];

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set. Add it to backend/.env before seeding.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('[seed] Connected to MongoDB');

  await Promise.all([User.deleteMany({}), Post.deleteMany({}), Circle.deleteMany({})]);
  console.log('[seed] Cleared existing users, posts, and circles');

  const users = await User.create(seedUsers);
  const [sarah, alex, elena, marcus] = users;

  await User.findByIdAndUpdate(sarah._id, { followers: [alex._id, elena._id, marcus._id], following: [alex._id, elena._id] });
  await User.findByIdAndUpdate(alex._id, { followers: [sarah._id], following: [sarah._id, elena._id] });
  await User.findByIdAndUpdate(elena._id, { followers: [sarah._id, alex._id], following: [sarah._id] });
  await User.findByIdAndUpdate(marcus._id, { following: [sarah._id] });

  const circles = await Circle.create(
    seedCircles.map((c, i) => ({ ...c, moderators: [users[i % users.length]._id], members: [users[0]._id, users[i % users.length]._id] }))
  );

  await Post.create([
    {
      author: alex._id,
      content:
        "Spent the weekend rebuilding our gateway's transport layer on WebTransport instead of raw WebSockets. The multiplexed streams over QUIC eliminate head-of-line blocking entirely — here's the core stream handler:",
      codeSnippet: {
        code: `async fn handle_stream(mut stream: SendStream, rx: Receiver<Frame>) -> Result<()> {\n    while let Ok(frame) = rx.recv().await {\n        let bytes = frame.encode()?;\n        stream.write_all(&bytes).await?;\n    }\n    stream.finish().await?;\n    Ok(())\n}`,
        language: 'rust',
        filename: 'transport/stream.rs',
      },
      tags: ['rust', 'webtransport', 'quic', 'systems'],
      likes: [sarah._id, elena._id, marcus._id],
      commentCount: 18,
      shareCount: 12,
      viewCount: 4210,
    },
    {
      author: elena._id,
      content:
        'CanvasUI 2.0 is live! We rebuilt the rendering engine around a retained-mode scene graph — 4x faster diffing on large canvases.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      tags: ['product-launch', 'canvasui', 'design-systems'],
      likes: [sarah._id, alex._id],
      commentCount: 34,
      shareCount: 21,
      viewCount: 6820,
    },
    {
      author: sarah._id,
      content:
        'Notes from debugging a nasty false-sharing bug in our ring buffer implementation. Padding hot fields to cache-line boundaries took throughput from 1.2M ops/sec to 4.8M ops/sec.',
      codeSnippet: {
        code: `struct AlignedCounter {\n    value: AtomicU64,\n    _pad: [u8; 56], // pad to 64-byte cache line\n}`,
        language: 'rust',
        filename: 'bench/aligned_counter.rs',
      },
      tags: ['performance', 'rust', 'concurrency'],
      likes: [alex._id, marcus._id],
      commentCount: 9,
      shareCount: 5,
      viewCount: 2103,
    },
    {
      author: marcus._id,
      content:
        "Implemented leader election with Raft from scratch this week for a side project. The hardest part isn't the algorithm — it's getting the timing right for election timeouts under real network jitter.",
      tags: ['raft', 'distributed-systems', 'go'],
      likes: [sarah._id],
      commentCount: 6,
      shareCount: 2,
      viewCount: 980,
    },
  ]);

  console.log(`[seed] Created ${users.length} users, ${circles.length} circles, and 4 posts`);
  console.log(`[seed] Demo password for every seeded account: ${DEMO_PASSWORD}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
