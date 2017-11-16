[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-in)

# \<xtal-in\>

\<xtal-in\> is a dependency-free component that curries events with semantically meaningful, and even unique, discoverable event names.

In the [groundbreaking blog post "Custom Elements That Work Anywhere"](http://robdodson.me/interoperable-custom-elements/), Rob Dodson blegs:

> **In general, don't bubble events unless they are semantically meaningful.** For example, *changed* is not a very semantically
> meaningful event, whereas *document-opened* would be. Non-semantic events can leak up and another element may accidentally handle them.  

This element, \<xtal-in\>, makes it easy to declaratively curry a standard click or input event into a user defined event name. One can also automatically generate a unique event name in a typesafe, discoverable way, by referring to a relative url or TypeScript filename (e.g.), which might contain a guid identifier.  

One can also declaratively configure whether the event should bubble, and even bubble outside the shadow DOM boundary via the composed flag.

<!--
```
<custom-element-demo>
  <template>
    <link rel="import" href="../xtal-in-sync.html">
    <xtal-in when-click dispatch-type-arg="hello" bubbles composed>
        <button>Click to dispatch custom event</button>
    </xtal-in>
    <script>
    document.body.addEventListener('hello', e =>{
        alert('received hello message');
    })
    </script>
  </template>
</custom-element-demo>
```
-->
```html

<xtal-in when-click dispatch event-name="hello" bubbles composed>
<button>Click to dispatch custom event</button>
</xtal-in>
<script>
document.body.addEventListener('hello', e =>{
    alert('received hello message');
})
</script>
```

TODO:

1)  Be able to avoid having to wrap the element, by allowing css selector
2)  Support when-attribute-change="some-attribute"
3)  Support binding for detail

The below markup assumes a library, like Polymer, is present to declaratively set the detail property.  
```html
<xtal-in for="#myTarget" when-attribute-changes="some-attribute" dispatch detail="[[myDetail]]"   event-name="hey-some-attribute-has-new-value" bubbles composed></xtal-in>
<my-awesome-custom-element id="myTarget" some-attribute="hello"></my-awsome-custom-element>
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
