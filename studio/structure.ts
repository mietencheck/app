import type {StructureResolver} from 'sanity/structure'
import {DocumentTextIcon, TagIcon, UserIcon} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('German posts')
        .icon(DocumentTextIcon)
        .child(
          S.documentList()
            .title('German posts')
            .filter('_type == "post" && language == "de"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
        ),
      S.listItem()
        .title('English posts')
        .icon(DocumentTextIcon)
        .child(
          S.documentList()
            .title('English posts')
            .filter('_type == "post" && language == "en"')
            .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
        ),
      S.divider(),
      S.listItem()
        .title('Authors')
        .icon(UserIcon)
        .child(S.documentTypeList('author').title('Authors')),
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(S.documentTypeList('category').title('Categories')),
    ])
