'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

let allSelects = [];

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
    let currentSelects = [].concat(allSelects);
    allSelects.length = 0;

    let copyOfCollection = JSON.parse(JSON.stringify(collection));

    let query = [].slice.call(arguments, 1);

    if (query.filter(function (item) {
        return item.name === 'select';
    }).length > 1) {
        query = query.filter(function (item) {
            return item.name !== 'select';
        });
        query.push(exports.select(currentSelects));
    }

    query.forEach((current, index) => {
        if (['limit', 'format'].includes(current.name)) {
            query.push(current);
            query.splice(index, 1);
        }
        if (['filterIn', 'sortBy', 'or'].includes(current.name)) {
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
    let args;
    if (Array.isArray(arguments[0])) { // real nigga shit
        args = [].slice.call(arguments[0]);
    } else {
        args = [].slice.call(arguments);
    }

    allSelects.push(args.toString());

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
     * @returns {Array}
     */
    exports.or = function () {
        let query = [].slice.call(arguments);

        return function or(collection) {
            let result = query.map(function (item) {
                return item(collection);
            }, collection);

            return result.reduce(function (acc, current) {
                return acc.concat(current);
            });
        };
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Array}
     */
    exports.and = function () {
        let query = [].slice.call(arguments);

        return function and(collection) {
            return query.reduce(function (acc, current) {
                return current(acc);
            }, collection);
        };
    };

}
