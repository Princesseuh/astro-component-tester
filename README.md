# astro-component-tester

Utility to help you write tests for your Astro components. In essence, what it does is create a temporary empty Astro project with only the selected component in a `src/pages/index.astro` file, then it builds it using the Astro CLI and finally, it returns the output of that build

While it's intended to be used when writing tests, you could also use it outside of that usecase, for instance to build a single component 😄

> Part of [astro-component-template](https://github.com/Princesseuh/astro-component-template)

## Usage

Examples below uses Mocha and Chai for convenience but this should work with any tools

```js
import { expect } from 'chai';
import { getComponentOutput } from 'astro-component-tester';

describe('Component', async () => {
  let component;

  // Component content here is equal to simply <div>Hello</div>
  before(async () => {
    component = await getComponentOutput('./src/Component.astro');
  });

  it('example component should say hello', () => {
    expect(component.html).to.contain('Hello');
  });
});
```

You can also pass props to the component, using the following method:

### Component

```astro
---
const { mySuperProp } = Astro.props
---

<div>{ mySuperProp + 1 }</div>
```

### Test

```js
import { expect } from 'chai';
import { getComponentOutput } from 'astro-component-tester';

describe('Component', async () => {
  let component;

  before(async () => {
    component = await getComponentOutput('./src/Component.astro', { mySuperProp: 1 });
  });

  it('example component should return 2', () => {
    expect(component.html).to.contain(2);
  });
});
```

Through a third parameter to `getComponentOutput`, it's possible to pass settings to the build operation, this is also how you can pass options to Astro itself, for instance, to test the output of a component that uses a Svelte component:

```js
import { expect } from 'chai';
import { getComponentOutput } from 'astro-component-tester';

describe('Component', async () => {
  let component;

  before(async () => {
    component = await getComponentOutput('./src/Component.astro', {}, { astroOptions: { renderers: ['@astrojs/renderer-svelte'] } });
  });

  it('example component should say hello using a Svelte component', () => {
    expect(component.html).to.contain('Hello from Svelte');
  });
});
```

## Limitations

### Context-specific variables

Since this work by building the component in an isolated environment, any variables depending on a specific context will be lost. For instance, `Astro.request` will always return the index page. Presumably, if you're building a component that should work in any instance, this wouldn't be an issue but it could become one for some components.

At the moment, `astro-component-tester` does not support any kind of mocking for supporting that use case
