import { createContext, useContext, useMemo, useState } from "react";

interface BlogTranslationContextValue {
  siblingSlug: string | null;
  setSiblingSlug: (slug: string | null) => void;
}

const BlogTranslationContext =
  createContext<BlogTranslationContextValue | null>(null);

export function BlogTranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siblingSlug, setSiblingSlug] = useState<string | null>(null);
  const value = useMemo(() => ({ siblingSlug, setSiblingSlug }), [siblingSlug]);

  return (
    <BlogTranslationContext.Provider value={value}>
      {children}
    </BlogTranslationContext.Provider>
  );
}

export function useBlogTranslation() {
  const context = useContext(BlogTranslationContext);
  if (!context) {
    return {
      siblingSlug: null,
      setSiblingSlug: () => undefined,
    };
  }
  return context;
}
