// Фабрика форматтеров
function getFormatter(format, options) {
  switch (format.toLowerCase()) {
    case 'epub':
      return new EpubFormatter(options);
    case 'pdf':
      return new PdfFormatter(options);
    case 'txt':
      return new TxtFormatter(options);
    case 'html':
      return new HtmlFormatter(options);
    case 'fb2':
      return new Fb2Formatter(options);
    case 'cbz':
      return new CbzFormatter(options);
    case 'zip':
      return new CbzFormatter(options);
    default:
      return new EpubFormatter(options);
  }
}
