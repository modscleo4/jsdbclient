/**
 * Copyright 2020 Dhiego Casssiano Fogaça Barbosa

 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 *     http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @file This file parses URI into a JSON Object
 *
 * @author Dhiego Cassiano Fogaça Barbosa <modscleo4@outlook.com>
 * */

'use strict';

/**
 *
 * @param {string} options
 */
function parseOptions(options) {
    if (typeof options !== 'string') {
        throw new TypeError('options is not string.');
    }

    const regExp = /[?]?(?:(?<Option>[^=]+)(?:=(?<Value>[^&]*)[&]?)?)/gmiu;
    if (!regExp.test(options)) {
        throw new Error('Invalid options format.');
    }

    regExp.lastIndex = 0;

    const ret = {};

    for (const {groups: {Option, Value}} of options.matchAll(regExp)) {
        ret[Option] = Value;
    }

    return ret;
}

/**
 * Parses JSDB Connection string (URI-based)
 *
 * @param {string} uri The Connection string
 * @return {{password: string|null, port: number|null, host: string, options: {}, user: string|null, db: string|null}}
 */
module.exports = uri => {
    if (typeof uri !== 'string') {
        throw new TypeError('uri is not string.');
    }

    const regExp = /^jsdb:\/\/(?:(?<Username>[^:@]+)(?::(?<Password>[^@]+)+)?@)?(?<Host>[^@][^:\/]+)(?::(?<Port>\d+))?(?:\/(?<Database>[^?]+))?(?:\?(?<Options>(?:[^=]+(?:=[^&]+&?)?)+))?$/gmiu;
    if (!regExp.test(uri)) {
        throw new Error('Invalid URI format.');
    }

    regExp.lastIndex = 0;

    const ret = {
        host: '',
        port: null,
        db: null,
        user: null,
        password: null,
        options: {},
    };

    const {groups: {Username, Password, Host, Port, Database, Options}} = regExp.exec(uri);

    ret.host = Host;
    ret.port = Port;
    ret.db = Database;
    ret.user = Username;
    ret.password = Password;
    ret.options = parseOptions(Options);

    if (Port && (Port < 0 || Port > 65535)) {
        throw new RangeError('Port out of range (0-65535)');
    }

    return ret;
};
