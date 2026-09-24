// import { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { Code2, Image as ImageIcon, Send, X } from 'lucide-react';
// import Avatar from '../ui/Avatar';
// import Button from '../ui/Button';
// import useAuth from '../../hooks/useAuth';
// import { useCreatePostMutation } from '../../store/api/postsApi';
// import { validatePostForm } from '../../utils/validation';
// import { CODE_LANGUAGES } from '../../utils/constants';
// import { openAuthModal } from '../../store/slices/uiSlice';

// const MAX_TAGS = 5;
// const MAX_CONTENT = 4000;

// const PostComposer = () => {
//   const dispatch = useDispatch();
//   const { user, isAuthenticated } = useAuth();
//   const [createPost, { isLoading }] = useCreatePostMutation();

//   const [content, setContent] = useState('');
//   const [showCodeBlock, setShowCodeBlock] = useState(false);
//   const [code, setCode] = useState('');
//   const [language, setLanguage] = useState('javascript');
//   const [filename, setFilename] = useState('');
//   const [tagInput, setTagInput] = useState('');
//   const [tags, setTags] = useState([]);
//   const [imageUrl, setImageUrl] = useState('');
//   const [showImageInput, setShowImageInput] = useState(false);
//   const [errors, setErrors] = useState({});

//   if (!isAuthenticated) {
//     return (
//       <button
//         type="button"
//         onClick={() => dispatch(openAuthModal('signin'))}
//         className="card-surface p-space-md w-full text-left flex items-center gap-3 text-brand-slate hover:border-brand-border-tint"
//       >
//         <Avatar name="?" size="md" />
//         <span className="text-body-lg">Sign in to share what you're building…</span>
//       </button>
//     );
//   }

//   const addTag = () => {
//     const clean = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
//     if (clean && !tags.includes(clean) && tags.length < MAX_TAGS) {
//       setTags((prev) => [...prev, clean]);
//     }
//     setTagInput('');
//   };

//   const handleTagKeyDown = (e) => {
//     if (e.key === 'Enter' || e.key === ',') {
//       e.preventDefault();
//       addTag();
//     } else if (e.key === 'Backspace' && !tagInput && tags.length) {
//       setTags((prev) => prev.slice(0, -1));
//     }
//   };

//   const resetForm = () => {
//     setContent('');
//     setShowCodeBlock(false);
//     setCode('');
//     setFilename('');
//     setTags([]);
//     setTagInput('');
//     setImageUrl('');
//     setShowImageInput(false);
//     setErrors({});
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validatePostForm({ content });
//     if (Object.keys(validationErrors).length) {
//       setErrors(validationErrors);
//       return;
//     }

//     const payload = {
//       content: content.trim(),
//       tags,
//       image: imageUrl.trim(),
//       codeSnippet: showCodeBlock && code.trim() ? { code, language, filename: filename.trim() } : null,
//     };

//     try {
//       await createPost(payload).unwrap();
//       resetForm();
//     } catch (err) {
//       setErrors({ content: err?.data?.message || 'Something went wrong publishing your post.' });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="card-surface p-space-md flex flex-col gap-3">
//       <div className="flex items-start gap-3">
//         <Avatar src={user?.avatar} name={user?.name} size="md" />
//         <textarea
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//           placeholder="Share a build, a bug you squashed, or a question for the community…"
//           rows={3}
//           maxLength={MAX_CONTENT}
//           className="flex-1 resize-none bg-transparent text-body-lg placeholder:text-outline outline-none"
//         />
//       </div>

//       {errors.content && <p className="text-body-sm text-error ml-[52px]">{errors.content}</p>}

//       {showCodeBlock && (
//         <div className="ml-[52px] rounded-lg border border-brand-line overflow-hidden">
//           <div className="flex items-center gap-2 p-2 bg-surface-container-low border-b border-brand-line">
//             <select
//               value={language}
//               onChange={(e) => setLanguage(e.target.value)}
//               className="text-body-sm bg-surface-container-lowest border border-brand-line rounded px-2 py-1 outline-none"
//             >
//               {CODE_LANGUAGES.map((lang) => (
//                 <option key={lang} value={lang}>
//                   {lang}
//                 </option>
//               ))}
//             </select>
//             <input
//               value={filename}
//               onChange={(e) => setFilename(e.target.value)}
//               placeholder="filename (optional)"
//               className="flex-1 text-body-sm bg-surface-container-lowest border border-brand-line rounded px-2 py-1 outline-none"
//             />
//             <button
//               type="button"
//               onClick={() => {
//                 setShowCodeBlock(false);
//                 setCode('');
//               }}
//               className="p-1 text-brand-slate hover:text-error"
//               aria-label="Remove code block"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//           <textarea
//             value={code}
//             onChange={(e) => setCode(e.target.value)}
//             placeholder="Paste your code…"
//             rows={6}
//             className="w-full p-3 bg-[#0d1117] text-[#e6edf3] font-mono text-body-sm outline-none resize-y"
//           />
//         </div>
//       )}

//       {showImageInput && (
//         <div className="ml-[52px] flex items-center gap-2">
//           <input
//             value={imageUrl}
//             onChange={(e) => setImageUrl(e.target.value)}
//             placeholder="Paste an image URL…"
//             className="flex-1 h-9 px-3 rounded border border-brand-line text-body-sm outline-none focus:ring-2 focus:ring-primary-fixed"
//           />
//           <button
//             type="button"
//             onClick={() => {
//               setShowImageInput(false);
//               setImageUrl('');
//             }}
//             className="p-1.5 text-brand-slate hover:text-error"
//             aria-label="Remove image"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {tags.length > 0 && (
//         <div className="ml-[52px] flex flex-wrap gap-1.5">
//           {tags.map((tag) => (
//             <span
//               key={tag}
//               className="inline-flex items-center gap-1 bg-primary-fixed text-primary-container text-label-sm font-semibold px-2 py-1 rounded normal-case"
//             >
//               #{tag}
//               <button type="button" onClick={() => setTags((prev) => prev.filter((t) => t !== tag))} aria-label={`Remove tag ${tag}`}>
//                 <X className="w-3 h-3" />
//               </button>
//             </span>
//           ))}
//         </div>
//       )}

//       <div className="ml-[52px] flex items-center gap-2">
//         <input
//           value={tagInput}
//           onChange={(e) => setTagInput(e.target.value)}
//           onKeyDown={handleTagKeyDown}
//           onBlur={addTag}
//           placeholder={tags.length < MAX_TAGS ? 'Add a tag and press Enter…' : 'Tag limit reached'}
//           disabled={tags.length >= MAX_TAGS}
//           className="flex-1 h-9 px-3 rounded border border-brand-line text-body-sm outline-none focus:ring-2 focus:ring-primary-fixed disabled:opacity-50"
//         />
//       </div>

//       <div className="ml-[52px] flex items-center justify-between pt-2 border-t border-brand-line">
//         <div className="flex items-center gap-1">
//           <button
//             type="button"
//             onClick={() => setShowCodeBlock((v) => !v)}
//             className={`p-2 rounded-lg transition-colors ${showCodeBlock ? 'text-primary-container bg-primary-fixed' : 'text-brand-slate hover:bg-surface-container'}`}
//             aria-label="Toggle code block"
//             aria-pressed={showCodeBlock}
//           >
//             <Code2 className="w-5 h-5" />
//           </button>
//           <button
//             type="button"
//             onClick={() => setShowImageInput((v) => !v)}
//             className={`p-2 rounded-lg transition-colors ${showImageInput ? 'text-primary-container bg-primary-fixed' : 'text-brand-slate hover:bg-surface-container'}`}
//             aria-label="Add image URL"
//             aria-pressed={showImageInput}
//           >
//             <ImageIcon className="w-5 h-5" />
//           </button>
//           <span className="text-body-sm text-outline ml-2">{content.length}/{MAX_CONTENT}</span>
//         </div>

//         <Button type="submit" isLoading={isLoading} disabled={!content.trim()}>
//           <Send className="w-4 h-4" />
//           Publish
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default PostComposer;




import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Code2, Image as ImageIcon, Send, X } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import useAuth from '../../hooks/useAuth';
import { useCreatePostMutation } from '../../store/api/postsApi';
import { validatePostForm } from '../../utils/validation';
import { CODE_LANGUAGES } from '../../utils/constants';
import { openAuthModal } from '../../store/slices/uiSlice';

const MAX_TAGS = 5;
const MAX_CONTENT = 4000;

const PostComposer = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const [createPost, { isLoading }] = useCreatePostMutation();

  const [content, setContent] = useState('');
  const [showCodeBlock, setShowCodeBlock] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [filename, setFilename] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => dispatch(openAuthModal('signin'))}
        className="card-surface p-3 sm:p-space-md w-full text-left flex items-center gap-3 text-brand-slate hover:border-brand-border-tint"
      >
        <Avatar name="?" size="md" />
        <span className="text-body-md sm:text-body-lg">Sign in to share what you're building…</span>
      </button>
    );
  }

  const addTag = () => {
    const clean = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (clean && !tags.includes(clean) && tags.length < MAX_TAGS) {
      setTags((prev) => [...prev, clean]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const resetForm = () => {
    setContent('');
    setShowCodeBlock(false);
    setCode('');
    setFilename('');
    setTags([]);
    setTagInput('');
    setImageUrl('');
    setShowImageInput(false);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePostForm({ content, codeSnippet: showCodeBlock ? code : '', image: imageUrl });
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      content: content.trim() || (showCodeBlock && code.trim() ? 'Code snippet' : imageUrl.trim() ? 'Image post' : ''),
      tags,
      image: imageUrl.trim(),
      codeSnippet: showCodeBlock && code.trim() ? { code, language, filename: filename.trim() } : null,
    };

    try {
      await createPost(payload).unwrap();
      resetForm();
    } catch (err) {
      setErrors({ content: err?.data?.message || 'Something went wrong publishing your post.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-3 sm:p-space-md flex flex-col gap-3 w-full max-w-full overflow-hidden">
      <div className="flex items-start gap-3">
        <Avatar src={user?.avatar} name={user?.name} size="md" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share a build, a bug you squashed, or a question for the community…"
          rows={3}
          maxLength={MAX_CONTENT}
          className="flex-1 w-full min-w-0 resize-none bg-transparent text-body-md sm:text-body-lg placeholder:text-outline outline-none"
        />
      </div>

      {errors.content && <p className="text-body-sm text-error w-full sm:pl-[52px]">{errors.content}</p>}

      {showCodeBlock && (
        <div className="w-full sm:pl-[52px]">
          <div className="rounded-lg border border-brand-line overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 p-2 bg-surface-container-low border-b border-brand-line">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-body-sm bg-surface-container-lowest border border-brand-line rounded px-2 py-1 outline-none"
              >
                {CODE_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <input
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="filename (optional)"
                className="flex-1 min-w-[120px] text-body-sm bg-surface-container-lowest border border-brand-line rounded px-2 py-1 outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setShowCodeBlock(false);
                  setCode('');
                }}
                className="p-1 text-brand-slate hover:text-error ml-auto"
                aria-label="Remove code block"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code…"
              rows={6}
              className="w-full p-3 bg-[#0d1117] text-[#e6edf3] font-mono text-body-sm outline-none resize-y"
            />
          </div>
        </div>
      )}

      {showImageInput && (
        <div className="w-full sm:pl-[52px] flex items-center gap-2">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste an image URL…"
            className="flex-1 min-w-0 h-9 px-3 rounded border border-brand-line text-body-sm outline-none focus:ring-2 focus:ring-primary-fixed"
          />
          <button
            type="button"
            onClick={() => {
              setShowImageInput(false);
              setImageUrl('');
            }}
            className="p-1.5 text-brand-slate hover:text-error shrink-0"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {tags.length > 0 && (
        <div className="w-full sm:pl-[52px] flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-primary-fixed text-primary-container text-label-sm font-semibold px-2 py-1 rounded normal-case"
            >
              #{tag}
              <button type="button" onClick={() => setTags((prev) => prev.filter((t) => t !== tag))} aria-label={`Remove tag ${tag}`}>
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="w-full sm:pl-[52px]">
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={addTag}
          placeholder={tags.length < MAX_TAGS ? 'Add a tag and press Enter…' : 'Tag limit reached'}
          disabled={tags.length >= MAX_TAGS}
          className="w-full h-9 px-3 rounded border border-brand-line text-body-sm outline-none focus:ring-2 focus:ring-primary-fixed disabled:opacity-50"
        />
      </div>

      <div className="w-full sm:pl-[52px] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 pt-2 border-t border-brand-line">
        <div className="flex items-center gap-1 min-w-0">
          <button
            type="button"
            onClick={() => setShowCodeBlock((v) => !v)}
            className={`p-2 rounded-lg transition-colors ${showCodeBlock ? 'text-primary-container bg-primary-fixed' : 'text-brand-slate hover:bg-surface-container'}`}
            aria-label="Toggle code block"
            aria-pressed={showCodeBlock}
          >
            <Code2 className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setShowImageInput((v) => !v)}
            className={`p-2 rounded-lg transition-colors ${showImageInput ? 'text-primary-container bg-primary-fixed' : 'text-brand-slate hover:bg-surface-container'}`}
            aria-label="Add image URL"
            aria-pressed={showImageInput}
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <span className="text-body-sm text-outline ml-2 whitespace-nowrap">{content.length}/{MAX_CONTENT}</span>
        </div>

        <Button 
          type="submit" 
          isLoading={isLoading} 
          disabled={!content.trim() && !(showCodeBlock && code.trim()) && !imageUrl.trim()}
          className="w-full sm:w-auto shrink-0 justify-center"
        >
          <Send className="w-4 h-4" />
          Publish
        </Button>
      </div>
    </form>
  );
};

export default PostComposer;