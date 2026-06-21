export const joditConfig: any = {
  readonly: false,

  // Paste behavior
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  defaultActionOnPaste: 'insert_as_html', // Type-safe
  pastePlain: false, // preserve links

  // Link handling
  link: {
    followOnDblClick: false,
    target: '_blank',
  },

  // Clean HTML safely
  cleanHTML: {
    removeEmptyElements: false,
    removeEmptyAttributes: false,
  },

  // Toolbar buttons
  toolbarAdaptive: false,
  buttons: [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'ul',
    'ol',
    'align',
    'fontsize',
    'brush',
    'link',
    'unlink',
    'source',
  ],
};
