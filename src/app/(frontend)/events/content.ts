import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const noMatchingEventsIntro: DefaultTypedEditorState = {
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
            text: 'Ingen begivenheder matcher de valgte filtre',
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
            text: 'Mangler der noget på din liste? Du kan selv være med til at sætte gang i livet på See You There, ved at oprette dit eget event.',
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
            text: 'Gå til ',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            version: 1,
          },
          {
            type: 'link',
            version: 1,
            indent: 0,
            format: '',
            direction: 'ltr',
            fields: {
              linkType: 'custom',
              newTab: false,
              url: '/locations',
            },
            children: [
              {
                type: 'text',
                text: 'Lokationer',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                version: 1,
              },
            ],
          },
          {
            type: 'text',
            text: ' og vælg et sted at være vært for dit eget event — en koncert, en bogklub, en yoga-session eller bare en uformel sammenkomst.',
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
