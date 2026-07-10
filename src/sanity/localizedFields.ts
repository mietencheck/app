/** GROQ projection for a localized internationalized-array string field. */
export function localizedString(field: string, lang = "$lang") {
  return `coalesce(${field}[_key == ${lang}][0].value, ${field}[_key == "de"][0].value)`;
}

/** GROQ projection for category fields resolved in post queries. */
export const localizedCategoryProjection = `{
  "title": ${localizedString("title")},
  "slug": ${localizedString("slug")}
}`;
