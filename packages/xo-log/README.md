# xo-log [![Build Status](https://travis-ci.org/vatesfr/xen-orchestra.png?branch=master)](https://travis-ci.org/vatesfr/xen-orchestra)

> ${pkg.description}

## Install

Installation of the [npm package](https://npmjs.org/package/xo-log):

```
> npm install --save xo-log
```

## Usage

Everywhere something should be logged:

```js
import createLogger from 'xo-log'

const log = createLogger('xo-server-api')
log.warn('foo')
```

Then at application level you can choose how to handle these logs:

```js
import { configure, transports } from 'xo-log'

configure([
  {
    // if filter is a string, then it is pattern
    // (https://github.com/visionmedia/debug#wildcards) which is
    // matched against the namespace of the logs
    filter: process.env.DEBUG,

    transport: transports.console()
  },
  {
    // only levels >= warn
    level: 'warn',

    transport: transports.email({
      service: 'gmail',
      auth: {
        user: 'jane.smith@gmail.com',
        pass: 'H&NbECcpXF|pyXe#%ZEb'
      },
      from: 'jane.smith@gmail.com',
      to: [
        'jane.smith@gmail.com',
        'sam.doe@yahoo.com'
      ]
    })
  }
])
```

## Development

```
# Install dependencies
> npm install

# Run the tests
> npm test

# Continuously compile
> npm run dev

# Continuously run the tests
> npm run dev-test

# Build for production (automatically called by npm install)
> npm run build
```

## Contributions

Contributions are *very* welcomed, either on the documentation or on
the code.

You may:

- report any [issue](https://github.com/vatesfr/xo-web/issues/)
  you've encountered;
- fork and create a pull request.

## License

ISC © [Vates SAS](https://vates.fr)
