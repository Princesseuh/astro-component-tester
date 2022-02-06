# astro-component-tester

Utility to help you write tests for your Astro components. In essence, what it does is create a temporary empty Astro project with only the selected component and then it returns the final output of an Astro build. In the future, I hope you add more useful tools for testing your component

While it's intended to be used when writing tests, you could also use it outside of that usecase, if needed 😄

> Part of [astro-component-template](https://github.com/Princesseuh/astro-component-template)

## Usage

Examples below uses Mocha and Chai for convenience but this should work with any tools

```js
import { expect } from 'chai';
import { buildComponent } from 'astro-component-tester';

describe('Component', async () => {
  // Component content here is equal to simply <div>Hello</div>
  before(async () => {
    component = await buildComponent('./src/Component.astro');
  });

  it('example component should say hello', async () => {
    expect(component.html).to.contain('Hello');
  });
});
```

You can also pass props to the component, using the following method:

### Component

```astro
---
  const {
    mySuperProp
  } = Astro.props
---

<div>{ mySuperProp + 1 }</div>
```

### Test

```js
import { expect } from 'chai';
import { buildComponent } from 'astro-component-tester';

describe('Component', async () => {
  before(async () => {
    component = await buildComponent('./src/Component.astro', { mySuperProp: 1 });
  });

  it('example component should say hello', async () => {
    expect(component.html).to.contain(2);
  });
});
```

## Limitations

### Cannot currently pass options to Astro

It is not currently supported to pass options to Astro, so tests based on Astro-related settings don't work

### React/Vue/Svelte etc components

See previous point, since it's currently not possible to pass settings to Astro, renderers are currently not supported

### Context-specific variables

Since this work by building the component in an isolated environment, any variables depending on a specific context will be lost. For instance, `Astro.request` will always simply return the index page. Presumably, if you're building a component that should work in any instance, this wouldn't be an issue but it could become one for some components. At the moment, `astro-component-tester` does not support any kind of mocking for supporting that use case
