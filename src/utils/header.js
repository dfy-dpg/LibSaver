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
      // Обрабатываем секции в квадратных скобках
      let result = customTocFormat;

      // Сначала обрабатываем экранирование: \[ → [, \] → ]
      result = result.replace(/\\\[/g, '\x00').replace(/\\\]/g, '\x01');

      // Заменяем плейсхолдеры везде (и внутри скобок, и снаружи)
      result = result.replace('{vol}', volStr).replace('{num}', numStr).replace('{name}', nameStr);

      // Шаг 1: Удаляем пустые секции с разделителями вокруг
      // Ищем: ~ [] ~ или ~ [] или [] ~
      result = result.replace(/([^\w\s])\s*\[\s*\]\s*([^\w\s])/g, '$1$2');
      result = result.replace(/([^\w\s])\s*\[\s*\]$/, '$1');
      result = result.replace(/^\s*\[\s*\]\s*([^\w\s])/, '$1');

      // Шаг 2: Убираем квадратные скобки из оставшихся секций
      result = result.replace(/\[/g, '').replace(/\]/g, '');

      // Шаг 3: Удаляем разделитель + пробелы в конце строки
      result = result.replace(/([^\w\s])\s+$/, '$1');

      // Шаг 4: Удаляем пробелы + разделитель в начале строки
      result = result.replace(/^\s+([^\w\s])/, '$1');

      // Шаг 5: Схлопываем дубликаты разделителей (2+ одинаковых неалфавитных символов подряд)
      result = result.replace(/([^\w\s])\1+/g, '$1');

      // Восстанавливаем экранированные скобки
      result = result.replace(/\x00/g, '[').replace(/\x01/g, ']');

      return result.trim();
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
    case 'format4':
      // Кастомная логика для format4 (со слешами)
      title = `Том ${volStr} / Глава ${numStr} / ${nameStr}`;
      if (hideVolumeNumber) {
        title = `Глава ${numStr} / ${nameStr}`;
      }
      if (hideChapterName) {
        title = hideVolumeNumber ? `Глава ${numStr}` : `Том ${volStr} / Глава ${numStr}`;
      }
      return title.trim();
    case 'no_headers':
      // Без заголовков в контенте, но оставляем нормальный заголовок для UI/TOC
      title = `Том ${volStr}. Глава ${numStr}.${nameStr ? ' ' + nameStr : ''}`;
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
