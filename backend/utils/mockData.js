import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Demo password for every seeded mock account: "Feedants@123"
const DEMO_PASSWORD_HASH = bcrypt.hashSync('Feedants@123', 10);

export const genId = () => crypto.randomBytes(12).toString('hex');

const now = () => new Date().toISOString();

const sarahId = genId();
const alexId = genId();
const elenaId = genId();
const marcusId = genId();

export const mockUsers = [
  {
    _id: sarahId,
    name: 'Sarah Lin',
    username: 'sarahlin',
    email: 'sarah@feedants.dev',
    password: DEMO_PASSWORD_HASH,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeO9avLtUd3-vEB5n5IKd5MsVDQYDm7RnbBRyWbYNSIzi4I8fU2a8tEnMnr8RS1YLl63VWi5CAcaaZqu84FrSk-rytkgRcOL5hPFLnLVg92F6moC4WXSN_y1L189Mx-sVwcumS2ps2i6eEqNVWdhp24VYRvSpF7nPit52vRMYsggk5jgxq2eUWRqyuUuSRSRXkaU2OQw8uX0DkfZks7gcE0SCwX4wDx9iX8jjo9J1aCkyHPUJIDWM',
    coverImage: '',
    role: 'staff',
    title: 'Staff Engineer & Tech Creator @ CloudScale',
    company: 'CloudScale',
    location: 'San Francisco, CA',
    bio: 'I write about distributed systems, Rust, and the occasional WebAssembly rabbit hole. Previously @Stripe, @HashiCorp. Building in public.',
    website: 'https://sarahlin.dev',
    socials: { github: 'sarahlin', twitter: 'sarahlindev', linkedin: 'sarah-lin-dev' },
    techStack: ['Rust', 'TypeScript', 'Go', 'Kubernetes', 'WebAssembly'],
    followers: [alexId, elenaId, marcusId],
    following: [alexId, elenaId],
    circles: [],
    bookmarks: [],
    verified: true,
    isActive: true,
    lastActiveAt: now(),
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: alexId,
    name: 'Alex Rivera',
    username: 'alexrivera',
    email: 'alex@feedants.dev',
    password: DEMO_PASSWORD_HASH,
    avatar: 'https://i.pravatar.cc/150?img=12',
    coverImage: '',
    role: 'creator',
    title: 'Principal Engineer @ Latencia',
    company: 'Latencia',
    location: 'Austin, TX',
    bio: 'Systems programmer obsessed with zero-copy everything. Rust & WebTransport enthusiast.',
    website: '',
    socials: { github: 'alexrivera', twitter: '', linkedin: '' },
    techStack: ['Rust', 'C++', 'QUIC', 'WebTransport'],
    followers: [sarahId],
    following: [sarahId, elenaId],
    circles: [],
    bookmarks: [],
    verified: true,
    isActive: true,
    lastActiveAt: now(),
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: elenaId,
    name: 'Elena Rostova',
    username: 'elenarostova',
    email: 'elena@feedants.dev',
    password: DEMO_PASSWORD_HASH,
    avatar: 'https://i.pravatar.cc/150?img=45',
    coverImage: '',
    role: 'creator',
    title: 'Founder @ CanvasUI',
    company: 'CanvasUI',
    location: 'Berlin, DE',
    bio: 'Building CanvasUI — a design-to-code engine for product teams. Ex-Figma.',
    website: 'https://canvasui.dev',
    socials: { github: 'elenarostova', twitter: 'elenabuilds', linkedin: '' },
    techStack: ['TypeScript', 'React', 'WebGL', 'Design Systems'],
    followers: [sarahId, alexId],
    following: [sarahId],
    circles: [],
    bookmarks: [],
    verified: true,
    isActive: true,
    lastActiveAt: now(),
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: marcusId,
    name: 'Marcus Cho',
    username: 'marcuscho',
    email: 'marcus@feedants.dev',
    password: DEMO_PASSWORD_HASH,
    avatar: 'https://i.pravatar.cc/150?img=33',
    coverImage: '',
    role: 'member',
    title: 'Backend Engineer @ Meridian',
    company: 'Meridian',
    location: 'Toronto, CA',
    bio: 'Distributed consensus, Raft, and coffee.',
    website: '',
    socials: { github: 'marcuscho', twitter: '', linkedin: '' },
    techStack: ['Go', 'Raft', 'PostgreSQL'],
    followers: [],
    following: [sarahId],
    circles: [],
    bookmarks: [],
    verified: false,
    isActive: true,
    lastActiveAt: now(),
    createdAt: now(),
    updatedAt: now(),
  },
];

export const mockCircles = [
  {
    _id: genId(),
    name: 'TypeScript Community',
    slug: 'typescript-community',
    description: 'Everything TypeScript — types, tooling, and the eternal quest for stricter configs.',
    category: 'Frontend Architecture',
    icon: 'code',
    color: '#3178c6',
    members: [sarahId, elenaId],
    moderators: [sarahId],
    postCount: 128,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: genId(),
    name: 'Rust & Systems',
    slug: 'rust-and-systems',
    description: 'Low-level systems programming, memory safety, and performance engineering with Rust.',
    category: 'Low-Latency & WASM',
    icon: 'memory',
    color: '#ce422b',
    members: [sarahId, alexId],
    moderators: [alexId],
    postCount: 96,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: genId(),
    name: 'AI & Autonomous Agents',
    slug: 'ai-and-autonomous-agents',
    description: 'Agentic architectures, LLM tooling, and the infrastructure behind autonomous systems.',
    category: 'AI & Infra',
    icon: 'smart_toy',
    color: '#7c3aed',
    members: [sarahId, marcusId],
    moderators: [sarahId],
    postCount: 214,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: genId(),
    name: 'Large Scale System Design',
    slug: 'large-scale-system-design',
    description: 'Architecture reviews, scaling stories, and distributed systems trade-offs.',
    category: 'Systems & Backend',
    icon: 'hub',
    color: '#059669',
    members: [sarahId, marcusId, alexId],
    moderators: [marcusId],
    postCount: 173,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: genId(),
    name: 'Open Source Founders',
    slug: 'open-source-founders',
    description: 'For maintainers and founders building sustainable open-source companies.',
    category: 'Open Source',
    icon: 'diversity_3',
    color: '#f59e0b',
    members: [elenaId],
    moderators: [elenaId],
    postCount: 61,
    createdAt: now(),
    updatedAt: now(),
  },
];

export const mockPosts = [
  {
    _id: genId(),
    author: alexId,
    content:
      "Spent the weekend rebuilding our gateway's transport layer on WebTransport instead of raw WebSockets. The multiplexed streams over QUIC eliminate head-of-line blocking entirely — here's the core stream handler:",
    codeSnippet: {
      code: `async fn handle_stream(mut stream: SendStream, rx: Receiver<Frame>) -> Result<()> {
    while let Ok(frame) = rx.recv().await {
        let bytes = frame.encode()?;
        stream.write_all(&bytes).await?;
    }
    stream.finish().await?;
    Ok(())
}`,
      language: 'rust',
      filename: 'transport/stream.rs',
    },
    image: '',
    tags: ['rust', 'webtransport', 'quic', 'systems'],
    circle: null,
    likes: [sarahId, elenaId, marcusId],
    bookmarkedBy: [sarahId],
    comments: [],
    commentCount: 18,
    shareCount: 12,
    viewCount: 4210,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: genId(),
    author: elenaId,
    content:
      "CanvasUI 2.0 is live! We rebuilt the rendering engine around a retained-mode scene graph — 4x faster diffing on large canvases. Huge thanks to the early access design partners who stress-tested this for six weeks.",
    codeSnippet: null,
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    tags: ['product-launch', 'canvasui', 'design-systems'],
    circle: null,
    likes: [sarahId, alexId],
    bookmarkedBy: [],
    comments: [],
    commentCount: 34,
    shareCount: 21,
    viewCount: 6820,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: genId(),
    author: sarahId,
    content:
      "Notes from debugging a nasty false-sharing bug in our ring buffer implementation. Padding hot fields to cache-line boundaries took our throughput from 1.2M ops/sec to 4.8M ops/sec on the same hardware.",
    codeSnippet: {
      code: `struct AlignedCounter {
    value: AtomicU64,
    _pad: [u8; 56], // pad to 64-byte cache line
}`,
      language: 'rust',
      filename: 'bench/aligned_counter.rs',
    },
    image: '',
    tags: ['performance', 'rust', 'concurrency'],
    circle: null,
    likes: [alexId, marcusId],
    bookmarkedBy: [elenaId],
    comments: [],
    commentCount: 9,
    shareCount: 5,
    viewCount: 2103,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    _id: genId(),
    author: marcusId,
    content:
      "Implemented leader election with Raft from scratch this week for a side project. The hardest part isn't the algorithm — it's getting the timing right for election timeouts under real network jitter.",
    codeSnippet: null,
    image: '',
    tags: ['raft', 'distributed-systems', 'go'],
    circle: null,
    likes: [sarahId],
    bookmarkedBy: [],
    comments: [],
    commentCount: 6,
    shareCount: 2,
    viewCount: 980,
    isPublished: true,
    createdAt: now(),
    updatedAt: now(),
  },
];

export const mockComments = [];

export const mockDb = {
  users: mockUsers,
  posts: mockPosts,
  circles: mockCircles,
  comments: mockComments,
};

export default mockDb;
