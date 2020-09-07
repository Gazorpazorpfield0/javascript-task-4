'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    if (arguments.length === 1 && Array.isArray(arguments[0])) {
        return arguments[0];
    }

    let copyOfCollection = JSON.parse(JSON.stringify(collection));

    let query = [].slice.call(arguments, 1);

    query.forEach((current, index) => {
        if ((current.name === 'limit') || (current.name === 'format')) {
            query.push(current);
            query.splice(index, 1);
        }
        if ((current.name === 'filterIn') || (current.name === 'sortBy')) {
            query.unshift(current);
            query.splice(index + 1, 1);
        }
    });

    return query.reduce(function (acc, current) {
        return current(acc);
    }, copyOfCollection);
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Array}
 */
exports.select = function () {
    let args = [].slice.call(arguments);

    return function select(collection) {
        return JSON.parse(JSON.stringify(collection, args));
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Array}
 */
exports.filterIn = function (property, values) {
    console.info(property, values);

    return function filterIn(collection) {
        return collection.filter(function (item) {
            return values.includes(item[property]);
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Array}
 */
exports.sortBy = function (property, order) {
    console.info(property, order);

    return function sortBy(collection) {
        return collection.sort(function (a, b) {
            if (order === 'asc') {
                return a[property] - b[property];
            }
            if (order === 'desc') {
                return b[property] - a[property];
            }

            return '';
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Array}
 */
exports.format = function (property, formatter) {
    console.info(property, formatter);

    return function format(collection) {
        collection.forEach(function (item) {
            item[property] = formatter(item[property]);
        });

        return collection;
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Array}
 */
exports.limit = function (count) {
    console.info(count);

    return function limit(collection) {
        collection.length = count;

        return collection;
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}
