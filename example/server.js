'use strict';

const Crumb = require('..');
const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');

const server = Hapi.server({
    host: '127.0.0.1',
    port: 8000
});

const plugins = [
    Vision,
    {
        plugin: Crumb,
        options: {
            cookieOptions: {
                isSecure: false,

            }
        }
    }
];

(async () => {

    await server.register(plugins);

    server.views({
        relativeTo: __dirname,
        path: 'templates',
        engines: {
            html: require('handlebars')
        }
    });

    server.route({
        method: 'get',
        path: '/',
        handler: function (request, h) {

            return h.view('index', { title: 'test', message: 'hi' });
        }
    });

    const generate = function (request, h) {

        if (request.plugins.crumb) {
            const crumb = Cryptiles.randomString(10);
            request.plugins.crumb = crumb;
        }

        return request.plugins.crumb;
    };

    server.route({
        method: 'post',
        path: '/',
        handler: function (request, h) {
            // console.log(h.view('message', { title: 'test', message: request.payload.message }))
            return h.view('message', { title: 'test', message: request.payload.message });
        }
    });

    await server.start();

    console.log('Example server running at:', server.info.uri);
})();
