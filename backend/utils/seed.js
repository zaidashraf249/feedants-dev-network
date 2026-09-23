import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Circle from '../models/Circle.js';
import Comment from '../models/Comment.js';

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/feedants';
    console.log('[seed] Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);

    // 1. PEHLE PURANA DATA SEQUENTIALLY CLEAR KAREIN (Duplication Error Se Bachne Ke Liye)
    console.log('[seed] Clearing existing collections...');
    await User.deleteMany({});
    await Post.deleteMany({});
    await Circle.deleteMany({});
    await Comment.deleteMany({});

    const hashedPassword = await bcrypt.hash('Feedants@123', 12);

    // 2. SEED USERS
    console.log('[seed] Creating Users...');
    const usersData = [
      {
        name: 'Sarah Lin',
        username: 'sarahlin',
        email: 'sarah@feedants.dev',
        password: hashedPassword,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeO9avLtUd3-vEB5n5IKd5MsVDQYDm7RnbBRyWbYNSIzi4I8fU2a8tEnMnr8RS1YLl63VWi5CAcaaZqu84FrSk-rytkgRcOL5hPFLnLVg92F6moC4WXSN_y1L189Mx-sVwcumS2ps2i6eEqNVWdhp24VYRvSpF7nPit52vRMYsggk5jgxq2eUWRqyuUuSRSRXkaU2OQw8uX0DkfZks7gcE0SCwX4wDx9iX8jjo9J1aCkyHPUJIDWM',
        role: 'staff',
        title: 'Staff Engineer & Tech Creator @ CloudScale',
        company: 'CloudScale',
        location: 'San Francisco, CA',
        bio: 'I write about distributed systems, Rust, and the occasional WebAssembly rabbit hole. Building in public.',
        techStack: ['Rust', 'TypeScript', 'Go', 'Kubernetes', 'WebAssembly'],
        verified: true,
      },
      {
        name: 'Alex Rivera',
        username: 'alexrivera',
        email: 'alex@feedants.dev',
        password: hashedPassword,
        avatar: 'https://i.pravatar.cc/150?img=12',
        role: 'creator',
        title: 'Principal Engineer @ Latencia',
        company: 'Latencia',
        location: 'Austin, TX',
        bio: 'Systems programmer obsessed with zero-copy everything. Rust & WebTransport enthusiast.',
        techStack: ['Rust', 'C++', 'QUIC', 'WebTransport'],
        verified: true,
      },
      {
        name: 'Elena Rostova',
        username: 'elenarostova',
        email: 'elena@feedants.dev',
        password: hashedPassword,
        avatar: 'https://i.pravatar.cc/150?img=45',
        role: 'creator',
        title: 'Founder @ CanvasUI',
        company: 'CanvasUI',
        location: 'Berlin, DE',
        bio: 'Building CanvasUI — a design-to-code engine for product teams. Ex-Figma.',
        techStack: ['TypeScript', 'React', 'WebGL', 'Design Systems'],
        verified: true,
      },
      {
        name: 'Marcus Cho',
        username: 'marcuscho',
        email: 'marcus@feedants.dev',
        password: hashedPassword,
        avatar: 'https://i.pravatar.cc/150?img=33',
        role: 'member',
        title: 'Backend Engineer @ Meridian',
        company: 'Meridian',
        location: 'Seattle, WA',
        bio: 'Distributed systems & databases. Currently building high-throughput Raft clusters.',
        techStack: ['Go', 'Distributed Systems', 'Raft', 'PostgreSQL'],
        verified: false,
      },
      {
        name: 'Zaid Ashraf',
        username: 'zaid249',
        email: 'zaid@feedants.dev',
        password: hashedPassword,
        avatar: 'https://petapixel.com/assets/uploads/2022/07/337294main_pg62_as11-40-5903_full-762x800.jpeg',
        role: 'member',
        title: 'Full Stack Developer',
        company: 'Qaswa Tech',
        location: 'Nagpur, IN',
        bio: 'Crafting pixel-perfect full-stack systems with React, Node.js, Express, and Redux Toolkit.',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux Toolkit'],
        verified: true,
      },
    ];

    const users = await User.insertMany(usersData);
    const [sarah, alex, elena, marcus, zaid] = users;

    sarah.followers = [alex._id, elena._id, marcus._id];
    sarah.following = [alex._id, elena._id];
    alex.followers = [sarah._id, zaid._id];
    alex.following = [sarah._id, elena._id];
    elena.followers = [sarah._id, alex._id, zaid._id];
    elena.following = [sarah._id];
    marcus.followers = [sarah._id];
    marcus.following = [sarah._id, alex._id];
    zaid.followers = [sarah._id, alex._id];
    zaid.following = [sarah._id, alex._id, elena._id];

    await Promise.all(users.map((u) => u.save()));

    // 3. SEED CIRCLES
    console.log('[seed] Creating Circles...');
    const circlesData = [
      {
        name: 'Rust & Systems',
        slug: 'rust-systems',
        description: 'Low-level systems programming, memory safety, and performance engineering.',
        category: 'Low-Latency & WASM',
        icon: 'memory',
        color: '#ce422b',
        members: [sarah._id, alex._id, zaid._id],
        moderators: [alex._id],
      },
      {
        name: 'Open Source Founders',
        slug: 'open-source-founders',
        description: 'For maintainers and founders building sustainable open-source companies.',
        category: 'Open Source',
        icon: 'diversity_3',
        color: '#f59e0b',
        members: [sarah._id, elena._id],
        moderators: [sarah._id],
      },
      {
        name: 'TypeScript Community',
        slug: 'typescript-community',
        description: 'Everything TypeScript — types, tooling, and stricter configs.',
        category: 'Frontend Architecture',
        icon: 'code',
        color: '#3178c6',
        members: [sarah._id, elena._id, zaid._id],
        moderators: [sarah._id],
      },
      {
        name: 'AI & Autonomous Agents',
        slug: 'ai-autonomous-agents',
        description: 'Agentic architectures, LLM tooling, and infrastructure for autonomous systems.',
        category: 'AI & Infra',
        icon: 'smart_toy',
        color: '#7c3aed',
        members: [sarah._id, marcus._id, zaid._id],
        moderators: [marcus._id],
      },
      {
        name: 'Large Scale System Design',
        slug: 'large-scale-system-design',
        description: 'Architecture reviews, scaling stories, and distributed systems trade-offs.',
        category: 'Systems & Backend',
        icon: 'hub',
        color: '#059669',
        members: [sarah._id, marcus._id, alex._id],
        moderators: [marcus._id],
      },
    ];

    const circles = await Circle.insertMany(circlesData);
    const [cRust, cOS, cTS, cAI, cSystem] = circles;

    // 4. SEED POSTS
    console.log('[seed] Creating Posts...');
    const postsData = [
      {
        author: sarah._id,
        circle: cRust._id,
        content: 'Notes from debugging a nasty false-sharing bug in our ring buffer implementation. Padding hot fields to cache-line boundaries took throughput from 1.2M ops/sec to 4.8M ops/sec.',
        codeSnippet: {
          code: 'struct AlignedCounter {\n    value: AtomicU64,\n    _pad: [u8; 56], // pad to 64-byte cache line\n}',
          language: 'rust',
          filename: 'bench/aligned_counter.rs',
        },
        tags: ['performance', 'rust', 'concurrency'],
        likes: [alex._id, marcus._id, zaid._id],
        isPublished: true,
      },
      {
        author: sarah._id,
        circle: cOS._id,
        content: 'Building in public update: We crossed 5,000 GitHub stars on our open-source distributed tracing agent. Here is what we learned about community PR management.',
        tags: ['open-source', 'telemetry', 'growth'],
        likes: [elena._id, zaid._id],
        isPublished: true,
      },
      {
        author: sarah._id,
        circle: cSystem._id,
        content: 'Why we replaced gRPC with custom WebAssembly guest functions for ultra-low latency plugin execution.',
        codeSnippet: {
          code: 'pub fn execute_plugin(input: &[u8]) -> Result<Vec<u8>, WASMError> {\n    let instance = WASMRuntime::instantiate(GUEST_BYTECODE)?;\n    instance.call("process", input)\n}',
          language: 'rust',
          filename: 'runtime/wasm_plugin.rs',
        },
        tags: ['webassembly', 'systems', 'microservices'],
        likes: [alex._id, marcus._id],
        isPublished: true,
      },
      {
        author: alex._id,
        circle: cRust._id,
        content: 'Spent the weekend rebuilding our gateway transport layer on WebTransport instead of raw WebSockets. The multiplexed streams over QUIC eliminate head-of-line blocking entirely.',
        codeSnippet: {
          code: 'async fn handle_stream(mut stream: SendStream, rx: Receiver<Frame>) -> Result<()> {\n    while let Ok(frame) = rx.recv().await {\n        let bytes = frame.encode()?;\n        stream.write_all(&bytes).await?;\n    }\n    stream.finish().await?;\n    Ok(())\n}',
          language: 'rust',
          filename: 'transport/stream.rs',
        },
        tags: ['rust', 'webtransport', 'quic', 'systems'],
        likes: [sarah._id, elena._id, marcus._id, zaid._id],
        isPublished: true,
      },
      {
        author: alex._id,
        circle: cSystem._id,
        content: 'Zero-copy memory buffers in C++ vs Rust: A comprehensive benchmark under 100Gbps network load.',
        tags: ['benchmarks', 'cpp', 'rust', 'networking'],
        likes: [sarah._id, zaid._id],
        isPublished: true,
      },
      {
        author: alex._id,
        content: 'Reminder: Premature optimization is evil, but bad data layout will haunt your P99 latency forever.',
        tags: ['architecture', 'performance'],
        likes: [sarah._id, marcus._id, zaid._id],
        isPublished: true,
      },
      {
        author: elena._id,
        circle: cTS._id,
        content: 'CanvasUI 2.0 is live! We rebuilt the rendering engine around a retained-mode scene graph — 4x faster diffing on large canvases.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
        tags: ['product-launch', 'canvasui', 'design-systems'],
        likes: [sarah._id, alex._id, zaid._id],
        isPublished: true,
      },
      {
        author: elena._id,
        circle: cTS._id,
        content: 'TypeScript tip: Use template literal types with recursive mapped types to build type-safe CSS-in-JS style objects.',
        codeSnippet: {
          code: 'type ColorToken = `color-${"primary" | "secondary"}-${100 | 200 | 300}`;\ntype StyleConfig = { [K in ColorToken]?: string };',
          language: 'typescript',
          filename: 'types/theme.ts',
        },
        tags: ['typescript', 'frontend', 'dx'],
        likes: [sarah._id, zaid._id],
        isPublished: true,
      },
      {
        author: elena._id,
        content: 'WebGL shader optimization trick: Pre-calculating lighting matrices in vertex shaders instead of fragment shaders saved us 15ms per frame on mobile GPUs.',
        tags: ['webgl', 'graphics', 'frontend'],
        likes: [alex._id, zaid._id],
        isPublished: true,
      },
      {
        author: marcus._id,
        circle: cSystem._id,
        content: 'Implemented leader election with Raft from scratch this week for a side project. The hardest part is getting timing right for election timeouts under real network jitter.',
        tags: ['raft', 'distributed-systems', 'go'],
        likes: [sarah._id, alex._id, zaid._id],
        isPublished: true,
      },
      {
        author: marcus._id,
        circle: cAI._id,
        content: 'Benchmarking local vector databases for agentic memory retrieval: Qdrant vs Milvus vs pgvector.',
        codeSnippet: {
          code: 'SELECT id, content, 1 - (embedding <=> $1) AS similarity\nFROM document_embeddings\nORDER BY similarity DESC LIMIT 5;',
          language: 'sql',
          filename: 'queries/vector_search.sql',
        },
        tags: ['ai', 'databases', 'pgvector', 'infra'],
        likes: [sarah._id, zaid._id],
        isPublished: true,
      },
      {
        author: marcus._id,
        content: 'If your microservice architecture requires 12 RPC calls to render a single dashboard, you built a distributed monolith.',
        tags: ['microservices', 'architecture', 'rant'],
        likes: [sarah._id, alex._id, elena._id, zaid._id],
        isPublished: true,
      },
      {
        author: zaid._id,
        circle: cTS._id,
        content: 'Building Feedants: Integrated Redux Toolkit Query with custom Axios interceptors for seamless JWT refresh and optimistic cache updates!',
        codeSnippet: {
          code: 'export const apiSlice = createApi({\n  reducerPath: "api",\n  baseQuery: axiosBaseQuery(),\n  tagTypes: ["Post", "User", "Circle"],\n  endpoints: () => ({}),\n});',
          language: 'typescript',
          filename: 'store/apiSlice.ts',
        },
        tags: ['react', 'redux', 'mern', 'webdev'],
        likes: [sarah._id, alex._id, elena._id],
        isPublished: true,
      },
      {
        author: zaid._id,
        circle: cAI._id,
        content: 'Historical aviation engineering masterpiece: The Hindenburg airship structure.',
        image: 'https://images.squarespace-cdn.com/content/v1/675176954189cc3a0d973e74/1733392255407-5F6NSOO9OKDNUAD03JW1/The+Hindenburg+Disaster+By+Sam+Shere',
        tags: ['worldwar', 'aircraft', 'russia', 'usa'],
        likes: [sarah._id, marcus._id],
        isPublished: true,
      },
      {
        author: zaid._id,
        content: 'Clean Code Principle: Keep components atomic, extract domain logic into custom hooks, and let RTK handle your server state caching.',
        tags: ['clean-code', 'react', 'architecture'],
        likes: [sarah._id, elena._id],
        isPublished: true,
      },
    ];

    const posts = await Post.insertMany(postsData);

    // 5. SEED COMMENTS
    console.log('[seed] Creating Comments and attaching to Posts...');
    for (let i = 0; i < posts.length; i++) {
      const currentPost = posts[i];
      const commenter1 = users[(i + 1) % users.length];
      const commenter2 = users[(i + 2) % users.length];

      const createdComments = await Comment.insertMany([
        {
          post: currentPost._id,
          author: commenter1._id,
          content: 'Great insight! Thanks for sharing this detailed breakdown.',
          likes: [currentPost.author],
        },
        {
          post: currentPost._id,
          author: commenter2._id,
          content: 'Super helpful. How does this perform under heavy concurrent load?',
          likes: [],
        },
      ]);

      currentPost.comments = createdComments.map((c) => c._id);
      currentPost.commentCount = createdComments.length;
      await currentPost.save();
    }

    for (const circle of circles) {
      const count = await Post.countDocuments({ circle: circle._id });
      circle.postCount = count;
      await circle.save();
    }

    console.log('[seed] Database successfully seeded with rich demo data!');
    console.log(`[seed] Created: ${users.length} Users, ${circles.length} Circles, ${posts.length} Posts.`);

    if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[seed] Error seeding database:', error);
    if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
      process.exit(1);
    }
    throw error;
  }
};

export default seedDatabase;