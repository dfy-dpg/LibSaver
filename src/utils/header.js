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

      // Разбиваем на части: вне скобок и внутри скобок
      const parts = [];
      let lastIndex = 0;
      const sectionRegex = /\[([^\[\]]*)\]/g;
      let match;

      while ((match = sectionRegex.exec(result)) !== null) {
        // Добавляем текст до секции
        if (match.index > lastIndex) {
          parts.push({
            type: 'literal',
            content: result.slice(lastIndex, match.index)
          });
        }
        // Добавляем секцию
        parts.push({
          type: 'section',
          content: match[1]
        });
        lastIndex = match.index + match[0].length;
      }

      // Добавляем оставшийся текст после последней секции
      if (lastIndex < result.length) {
        parts.push({
          type: 'literal',
          content: result.slice(lastIndex)
        });
      }

      // Обрабатываем каждую часть
      const processedParts = [];
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.type === 'literal') {
          // Заменяем плейсхолдеры в тексте вне скобок
          let processed = part.content
            .replace('{vol}', volStr)
            .replace('{num}', numStr)
            .replace('{name}', nameStr);
          processedParts.push({
            type: 'literal',
            content: processed
          });
        } else if (part.type === 'section') {
          // Заменяем плейсхолдеры внутри секции
          let processed = part.content
            .replace('{vol}', volStr)
            .replace('{num}', numStr)
            .replace('{name}', nameStr);

          // Если секция пустая - пропускаем её
          if (!processed || processed.trim() === '') {
            processedParts.push({
              type: 'section',
              content: '',
              isEmpty: true
            });
          } else {
            // Добавляем секцию без скобок
            processedParts.push({
              type: 'section',
              content: processed,
              isEmpty: false
            });
          }
        }
      }

      // Удаляем пустые секции с разделителями
      const finalParts = [];
      for (let i = 0; i < processedParts.length; i++) {
        const part = processedParts[i];

        if (part.type === 'section' && part.isEmpty) {
          // Пропускаем пустую секцию, но удаляем разделители вокруг
          // Удаляем trailing разделитель из предыдущего literal
          if (finalParts.length > 0 && finalParts[finalParts.length - 1].type === 'literal') {
            const prevLiteral = finalParts[finalParts.length - 1];
            // Если предыдущий literal состоит только из разделителей, цифр и пробелов - удаляем его полностью
            if (/^[\d\s\p{P}\p{S}]+$/u.test(prevLiteral.content)) {
              finalParts.pop();
            } else {
              // Иначе удаляем только последний разделитель
              prevLiteral.content = prevLiteral.content.replace(/[\d\s\p{P}\p{S}]$/u, '');
            }
          }
          // Удаляем leading разделитель из следующего literal
          if (i + 1 < processedParts.length && processedParts[i + 1].type === 'literal') {
            const nextLiteral = processedParts[i + 1];
            // Если следующий literal состоит только из разделителей, цифр и пробелов - удаляем его полностью
            if (/^[\d\s\p{P}\p{S}]+$/u.test(nextLiteral.content)) {
              // Пропускаем его (не добавим в finalParts)
            } else {
              // Иначе удаляем только первый разделитель
              nextLiteral.content = nextLiteral.content.replace(/^[\d\s\p{P}\p{S}]/u, '');
            }
          }
        } else {
          finalParts.push(part);
        }
      }

      // Собираем результат
      result = finalParts.map(p => p.content).join('');

      // Схлопываем дубликаты разделителей (Unicode-aware)
      result = result.replace(/([\p{P}\p{S}])\1+/gu, '$1');

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
