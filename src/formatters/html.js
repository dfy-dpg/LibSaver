class HtmlFormatter extends BaseFormatter {
  constructor(options) {
    super(options);
  }

  getExtension() {
    return 'html';
  }

  getMimeType() {
    return 'text/html';
  }

  async format(chapters, metadata) {
    throw new Error('HTML формат в разработке');
  }
}
