import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Badge from '../ui/Badge';

const TechStackBadges = ({ techStack = [], editable = false, onChange }) => {
  const [draft, setDraft] = useState('');

  const addSkill = () => {
    const clean = draft.trim();
    if (clean && !techStack.includes(clean)) {
      onChange?.([...techStack, clean]);
    }
    setDraft('');
  };

  if (!editable && techStack.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full">
      {techStack.map((tech) => (
        <Badge key={tech} variant="primary" className="normal-case font-medium gap-1.5 max-w-full truncate">
          <span className="truncate">{tech}</span>
          {editable && (
            <button
              type="button"
              onClick={() => onChange?.(techStack.filter((t) => t !== tech))}
              aria-label={`Remove ${tech}`}
              className="shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </Badge>
      ))}

      {editable && (
        <div className="flex items-center gap-1 max-w-full">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add skill"
            className="h-7 w-24 sm:w-28 px-2 rounded border border-brand-line text-body-xs sm:text-body-sm outline-none focus:ring-2 focus:ring-primary-fixed min-w-0"
          />
          <button
            type="button"
            onClick={addSkill}
            className="p-1.5 rounded-full bg-primary-fixed text-primary-container hover:bg-primary-fixed/70 shrink-0"
            aria-label="Add skill"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TechStackBadges;