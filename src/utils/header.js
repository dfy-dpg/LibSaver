// formatUtils.js - Утилиты для форматирования заголовков глав

/**
 * Форматирует название главы в зависимости от настроек
 * @param {string} vol - Номер тома
 * @param {string} num - Номер главы
 * @param {string} name - Название главы
 * @param {string} tocFormat - Выбранный формат (default, format1, format2, format3, custom)
 * @param {string} customTocFormat - Пользовательский формат
 * @param {boolean} hideChapterName - Скрыть названия глав
 * @param {boolean} hideVolumeNumber - Скрыть номера томов
 * @returns {string} Отформатированный заголовок
 */
function formatChapterTitle(vol, num, name, tocFormat, customTocFormat, hideChapterName, hideVolumeNumber) {
  const volStr = vol || '1';
  const numStr = num || '1';
  const nameStr = name || '';
  
  // Пользовательский формат - галочки не работают
  if (tocFormat === 'custom') {
    if (customTocFormat) {
      return customTocFormat
        .replace('{vol}', volStr)
        .replace('{num}', numStr)
        .replace('{name}', nameStr)
        .trim();
    }
    // Fallback если custom формат пустой
    return `Том ${volStr}. Глава ${numStr}.${nameStr ? ' ' + nameStr : ''}`.trim();
  }
  
  // Встроенные форматы - учитываем галочки
  let title = '';
  
  switch (tocFormat) {
    case 'format1':
      title = `Том ${volStr} Глава ${numStr} ${nameStr}`;
      break;
    case 'format2':
      title = `Том ${volStr} Глава ${numStr} ${nameStr ? '- ' + nameStr : ''}`;
      break;
    case 'format3':
      title = `Том ${volStr} - Глава ${numStr} ${nameStr ? '- ' + nameStr : ''}`;
      break;
    case 'default':
    default:
      title = `Том ${volStr}. Глава ${numStr}.${nameStr ? ' ' + nameStr : ''}`;
      break;
  }
  
  // Применяем галочки для встроенных форматов
  if (hideVolumeNumber) {
    // Убираем всё до "Глава" включительно
    title = title.replace(/.*Глава\s*/, 'Глава ');
  }
  
  if (hideChapterName) {
    // Убираем всё после номера главы (включая дробные номера типа 0.1)
    title = title.replace(/(Глава\s+[\d.]+).*$/, '$1').trim();
  }
  
  return title.trim();
}
