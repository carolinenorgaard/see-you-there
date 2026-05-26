import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const hostEventIntro: DefaultTypedEditorState = {
  root: {
    type: 'root',
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'heading',
        tag: 'h2',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: 'Vært for dit eget event på en lokation',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      },
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: 'Her finder du de lokationer, vi har samlet på See You There. Du kan ikke selv tilføje nye lokationer, men du kan være med til at sætte gang i livet på dem, der allerede er her.',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      },
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: 'Vælg en af lokationerne nedenfor og opret dit eget event dér — uanset om det er en koncert, en bogklub, en yoga-session eller bare en uformel sammenkomst. Når du opretter et event, vises det på ',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
          {
            type: 'text',
            text: 'Event Wall',
            detail: 0,
            format: 1,
            mode: 'normal',
            style: '',
            version: 1,
          },
          {
            type: 'text',
            text: ' under Community-fanen, så andre kan finde det, deltage og dele oplevelsen.',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      },
      {
        type: 'paragraph',
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            type: 'text',
            text: 'Det er gratis, nemt og en god måde at samle folk omkring noget, du brænder for.',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
        ],
      },
    ],
  },
} as DefaultTypedEditorState
