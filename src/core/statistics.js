// statistics.js - Централизованный модуль статистики
// Управляет счётчиками ошибок, размера файла, времени загрузки и т.д.

// Состояние статистики
var chapterTimes = []; // Время загрузки каждой главы
var totalFileSize = 0; // Общий размер файла в байтах
var totalErrorCount = 0; // Общее количество ошибок (главы + картинки)
var skippedChaptersCount = 0; // Количество пропущенных глав
var skippedImagesCount = 0; // Количество пропущенных картинок
var oldFormatChaptersCount = 0; // Количество глав старого формата
var oldFormatChaptersList = []; // Список глав старого формата
var totalChapters = 0; // Всего глав загружено
var totalCovers = 0; // Всего обложек загружено
var totalImages = 0; // Всего картинок загружено
var currentChapterIndex = 0; // Индекс текущей главы
var downloadStartTime = null; // Время начала загрузки
var lastRecordTime = null; // Время последнего вызова recordChapterTime

// Функция для записи времени загрузки главы
function recordChapterTime() {
    if (!downloadStartTime) return;
    
    const currentTime = Date.now();
    
    // Если это первый вызов - просто запоминаем время
    if (!lastRecordTime) {
        lastRecordTime = currentTime;
        return;
    }
    
    const elapsedSeconds = (currentTime - lastRecordTime) / 1000;
    
    // Проверяем на аномально маленькие значения (менее 0.1 сек)
    if (elapsedSeconds >= 0.1) {
        chapterTimes.push(elapsedSeconds);
    }
    
    lastRecordTime = currentTime;
}

// Функция для добавления размера файла
function addFileSize(size) {
    if (typeof size === 'number' && size > 0) {
        totalFileSize += size;
    }
}

// Функция для увеличения счётчика ошибок
function incrementErrorCount() {
    totalErrorCount++;
}

// Функция для увеличения счётчика пропущенных картинок
function incrementSkippedImagesCount() {
    skippedImagesCount++;
}

// Функция для добавления главы старого формата
function addOldFormatChapter(chapterTitle) {
    oldFormatChaptersCount++;
    oldFormatChaptersList.push(chapterTitle);
}

// Функция для установки количества глав
function setTotalChapters(count) {
    totalChapters = count;
}

// Функция для увеличения счётчика глав
function incrementTotalChapters() {
    totalChapters++;
}

// Функция для установки количества обложек
function setTotalCovers(count) {
    totalCovers = count;
}

// Функция для увеличения счётчика обложек
function incrementTotalCovers() {
    totalCovers++;
}

// Функция для установки количества картинок
function setTotalImages(count) {
    totalImages = count;
}

// Функция для увеличения счётчика картинок
function incrementTotalImages() {
    totalImages++;
}

// Функция для увеличения счётчика пропущенных глав
function incrementSkippedChaptersCount() {
    skippedChaptersCount++;
}

// Функция для обновления индекса текущей главы
function updateChapterIndex(index) {
    if (typeof index === 'number' && index >= 0) {
        currentChapterIndex = index;
    }
}

// Функция для установки времени начала загрузки
function setDownloadStartTime() {
    downloadStartTime = Date.now();
}

// Функция для сброса статистики
function resetStatistics() {
    chapterTimes = [];
    totalFileSize = 0;
    totalErrorCount = 0;
    skippedChaptersCount = 0;
    skippedImagesCount = 0;
    oldFormatChaptersCount = 0;
    oldFormatChaptersList = [];
    totalChapters = 0;
    totalCovers = 0;
    totalImages = 0;
    currentChapterIndex = 0;
    downloadStartTime = null;
    lastRecordTime = null;
}

// Функция для получения значения статистики
function getStatisticsValue(name) {
    switch(name) {
        case 'chapterTimes': return chapterTimes;
        case 'totalFileSize': return totalFileSize;
        case 'totalErrorCount': return totalErrorCount;
        case 'skippedChaptersCount': return skippedChaptersCount;
        case 'skippedImagesCount': return skippedImagesCount;
        case 'oldFormatChaptersCount': return oldFormatChaptersCount;
        case 'oldFormatChaptersList': return oldFormatChaptersList;
        case 'totalChapters': return totalChapters;
        case 'totalCovers': return totalCovers;
        case 'totalImages': return totalImages;
        case 'currentChapterIndex': return currentChapterIndex;
        case 'downloadStartTime': return downloadStartTime;
        default: return null;
    }
}

// Функция для установки значения статистики
function setStatisticsValue(name, value) {
    switch(name) {
        case 'chapterTimes': chapterTimes = value; break;
        case 'totalFileSize': totalFileSize = value; break;
        case 'totalErrorCount': totalErrorCount = value; break;
        case 'skippedChaptersCount': skippedChaptersCount = value; break;
        case 'skippedImagesCount': skippedImagesCount = value; break;
        case 'oldFormatChaptersCount': oldFormatChaptersCount = value; break;
        case 'oldFormatChaptersList': oldFormatChaptersList = value; break;
        case 'totalChapters': totalChapters = value; break;
        case 'totalCovers': totalCovers = value; break;
        case 'totalImages': totalImages = value; break;
        case 'currentChapterIndex': currentChapterIndex = value; break;
        case 'downloadStartTime': downloadStartTime = value; break;
    }
}

// Экспортируем функции в window для глобального доступа
window.recordChapterTime = recordChapterTime;
window.addFileSize = addFileSize;
window.incrementErrorCount = incrementErrorCount;
window.incrementSkippedImagesCount = incrementSkippedImagesCount;
window.incrementSkippedChaptersCount = incrementSkippedChaptersCount;
window.addOldFormatChapter = addOldFormatChapter;
window.setTotalChapters = setTotalChapters;
window.incrementTotalChapters = incrementTotalChapters;
window.setTotalCovers = setTotalCovers;
window.incrementTotalCovers = incrementTotalCovers;
window.setTotalImages = setTotalImages;
window.incrementTotalImages = incrementTotalImages;
window.updateChapterIndex = updateChapterIndex;
window.setDownloadStartTime = setDownloadStartTime;
window.resetStatistics = resetStatistics;
window.getStatisticsValue = getStatisticsValue;
window.setStatisticsValue = setStatisticsValue;
