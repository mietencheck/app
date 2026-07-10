export const SUPPORTED_LANGUAGES = [
  {id: 'de', title: 'German'},
  {id: 'en', title: 'English'},
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]['id']
