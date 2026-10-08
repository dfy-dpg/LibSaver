// Универсальные кнопки прокрутки для всех страниц редакторов

// Глобальные переменные для доступа из других файлов
let currentDirection = null;
let rotation = 0;
let scrollTimeout = null;
let edgeTimeout = null;

function setupScrollButtons() {
  const scrollButtons = document.getElementById('scroll-buttons');
  const scrollBtn = document.getElementById('scroll-btn');
  const scrollIcon = scrollBtn.querySelector('i');

  if (!scrollButtons || !scrollBtn || !scrollIcon) return;

  let lastScrollTop = 0;

  // Скрываем кнопку через 4 секунды после остановки прокрутки
  const hideButton = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      // Плавно скрываем
      scrollBtn.style.opacity = '0';
      scrollButtons.style.opacity = '0';
      setTimeout(() => {
        scrollBtn.style.visibility = 'hidden';
        scrollButtons.style.display = 'none';
      }, 150);
    }, 4000);
  };

  // Делаем hideButton доступной глобально
  window.hideScrollButton = hideButton;

  // Скрываем кнопку через 2 секунды если у края
  const hideButtonFromEdge = () => {
    if (edgeTimeout) {
      clearTimeout(edgeTimeout);
    }
    edgeTimeout = setTimeout(() => {
      // Плавно скрываем
      scrollBtn.style.opacity = '0';
      scrollButtons.style.opacity = '0';
      setTimeout(() => {
        scrollBtn.style.visibility = 'hidden';
        scrollButtons.style.display = 'none';
      }, 150);
    }, 2000);
  };

  // Отслеживаем прокрутку
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollBottom = documentHeight - windowHeight - scrollTop;

    // Если скролла нет (контент помещается на экране) - скрываем кнопку
    if (documentHeight <= windowHeight) {
      scrollBtn.style.opacity = '0';
      scrollButtons.style.opacity = '0';
      setTimeout(() => {
        scrollBtn.style.visibility = 'hidden';
        scrollButtons.style.display = 'none';
      }, 150);
      return;
    }

    // Определяем направление прокрутки
    const isScrollingDown = scrollTop > lastScrollTop;
    lastScrollTop = scrollTop;

    // Сбрасываем таймеры при прокрутке
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    if (edgeTimeout) {
      clearTimeout(edgeTimeout);
    }

    // Проверяем - совсем у краёв не показываем, но через 2 секунды скрываем
    // Используем небольшой допуск для учёта масштаба страницы
    const atTop = scrollTop < 5;
    const atBottom = scrollBottom < 5;

    if (atTop || atBottom) {
      // Совсем у верха или совсем у низа - меняем иконку на противоположное направление
      if (atTop) {
        // У верха - показываем иконку вниз
        if (currentDirection !== 'down') {
          rotation += 180;
          scrollIcon.style.transform = `rotate(${rotation}deg)`;
          scrollBtn.title = 'Вниз';
          currentDirection = 'down';
        }
      } else if (atBottom) {
        // У низа - показываем иконку наверх
        if (currentDirection !== 'up') {
          rotation += 180;
          scrollIcon.style.transform = `rotate(${rotation}deg)`;
          scrollBtn.title = 'Наверх';
          currentDirection = 'up';
        }
      }

      // Скрываем через 2 секунды
      hideButtonFromEdge();
      return;
    }

    // Показываем контейнер
    scrollButtons.style.display = 'block';
    setTimeout(() => scrollButtons.style.opacity = '1', 10);

    // Показываем кнопку
    scrollBtn.style.visibility = 'visible';
    setTimeout(() => scrollBtn.style.opacity = '1', 10);

    // Меняем иконку в зависимости от направления
    if (isScrollingDown && scrollBottom > 50) {
      // Крутим вниз - докручиваем на 180°
      if (currentDirection !== 'down') {
        rotation += 180;
        scrollIcon.style.transform = `rotate(${rotation}deg)`;
        scrollBtn.title = 'Вниз';
        currentDirection = 'down';
      }
    } else if (!isScrollingDown && scrollTop > 50) {
      // Крутим вверх - докручиваем на 180°
      if (currentDirection !== 'up') {
        rotation += 180;
        scrollIcon.style.transform = `rotate(${rotation}deg)`;
        scrollBtn.title = 'Наверх';
        currentDirection = 'up';
      }
    }

    // Запускаем таймер скрытия
    hideButton();
  });

  // Клик на кнопку
  scrollBtn.addEventListener('click', () => {
    if (currentDirection === 'up') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
}

// Функция для переключения кнопки на "вниз" (вызывается из chapters.js)
function switchScrollButtonToDown() {
  const scrollButtons = document.getElementById('scroll-buttons');
  const scrollBtn = document.getElementById('scroll-btn');
  const scrollIcon = scrollBtn?.querySelector('i');

  if (!scrollButtons || !scrollBtn || !scrollIcon) return;

  // Переключаем на "вниз"
  if (currentDirection !== 'down') {
    rotation += 180;
    scrollIcon.style.transform = `rotate(${rotation}deg)`;
    scrollBtn.title = 'Вниз';
    currentDirection = 'down';
  }

  // Показываем кнопку если она скрыта
  scrollButtons.style.display = 'block';
  setTimeout(() => scrollButtons.style.opacity = '1', 10);
  scrollBtn.style.visibility = 'visible';
  setTimeout(() => scrollBtn.style.opacity = '1', 10);

  // Сбрасываем таймеры скрытия
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  if (edgeTimeout) {
    clearTimeout(edgeTimeout);
  }

  // Запускаем таймер скрытия на 4000ms (как в середине страницы)
  if (typeof window.hideScrollButton === 'function') {
    window.hideScrollButton();
  }
}

// Инициализация при загрузке DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupScrollButtons);
} else {
  setupScrollButtons();
}