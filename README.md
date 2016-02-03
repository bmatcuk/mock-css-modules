![Release](https://img.shields.io/npm/v/mock-css-modules.svg)

# mock-css-modules
[Webpack](https://webpack.github.io/) loaders are great. With them, you can
`require()` just about any file and the loaders will take care of transpiling
into javascript.

CSS Modules are great because you can write CSS for each of your components
without worrying about rules from one stepping on the rules of another. The
aforementioned webpack loaders (the [css-loader](https://github.com/webpack/css-loader)
in particular) will let you `require()` your CSS and return a nice map of
original class names to generated CSS Module class names so you can do
something like:

```javascript
import styles from './styles.css';
import {render} from 'react-dom';

render(<h1 class={styles.myClass}>Hello, World!</h1>, document.body);
```

The problem is testing... your testing toolchain ([mocha](https://mochajs.org/)
perhaps) doesn't know how to require CSS files. This inevitably leads to a
syntax error while node tries to parse the CSS as if it was javascript.

## How Can We Fix This?
There are several solutions to this problem. The most common solutions either
attempt to parse the CSS faithfully or attempt to ignore the CSS `require()`
altogether.

In the first case, you're just complicating things and wasting time. In my
automated tests, I don't _need_ to know that `myClass` is going to become
`_23_aKvs-b8bW2Vg3fwHozO`, so why should I waste the time to parse the CSS to
find that out? Further, if there's an error in my CSS, the parsing will fail
and cause my component test to fail... is that where the failure belongs? I
dunno... maybe, maybe not...

In the second case, all of my class names become empty strings in my automated
tests. While it's true that I don't need to know _exactly_ what my class names
will become after transpiling, I might want to be able to test that there is
_some_ class and I can't do that if just make my CSS `require()`s return null.

### mock-css-modules' solution
mock-css-modules' solution is somewhere between the former and the latter.
mock-css-modules registers a handler for requiring CSS files. When node comes
upon a `require()` for a CSS file, it will run mock-css-modules' handler which
will return a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
object. This Proxy object will trap getters and return the name of the
requested property as a string. So, for example:

```javascript
import styles from './styles.css';

styles.myClass
=> "myClass"

styles.anotherClass
=> "anotherClass"

etc ...
```

This gives all of our classes names without the overhead of parsing the actual
CSS files. And since code that is using CSS Modules shouldn't be making any
assumptions about the names of the generated classes, these values are just as
valid as the real ones so they shouldn't cause any issues.

## Installation
This package makes use of the `--harmony-proxies` node option. I'm not sure in
what version that was added, but you may need a newish version. Install with
npm:

```bash
npm install --save-dev mock-css-modules
```

## Usage
As noted above, this package makes use of the `--harmony-proxies` option. This
means that however you start node, you'll need to pass that option. Then,
simply `require("mock-css-modules")` before any CSS files and you'll be rockin'.
By default, mock-css-modules will handle `require()`d .css files. If your
project has some other extensions (such as .sass, .scss, etc), you'll need to
register handlers for those, too:

```javascript
var mockCssModules = require("mock-css-modules");

mockCssModules.register(['.sass', '.scss', ...]);
```

Unfortunately, this means that if you are taking advantage of webpack's
resolvers to `require()` files without extensions, it won't work. You should
use extensions for your CSS files.

### Mocha
If you are using mocha to run your tests, you can use mock-css-modules from the
command line:

```bash
mocha --require mock-css-modules --harmony-proxies ...
```

If you need to handle additional extensions, copy the two lines above into a
file called `test-setup.js`, for example, and require the file instead of
mock-css-modules directly:

```bash
mocha --require test-setup.js --harmony-proxies ...
```

