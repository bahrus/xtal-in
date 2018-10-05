[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-in)

# \<xtal-in\>

\<xtal-in\> is a vanilla-ish custom element that generates events with semantically meaningful, and even unique, discoverable event names.  

The -in- in xtal-in- refers to an "input channel" -- which can be a clickable dom element, for example, or more abstract things like attributes, or query string parameters in the address bar.  The latter two "input channels" can be used to build web components that can also be hosted as a standalone url.

In the [groundbreaking blog post "Custom Elements That Work Anywhere"](http://robdodson.me/interoperable-custom-elements/), Rob Dodson blegs:

> **In general, don't bubble events unless they are semantically meaningful.** For example, *changed* is not a very semantically
> meaningful event, whereas *document-opened* would be. Non-semantic events can leak up and another element may accidentally handle them. 

Adding an event listener to an element, whose sole purpose is to bubble the event up with a different name, is a rather insulting task for the powerful and sophisticated JavaScript language to handle.  JavaScript should only be bothered with important stuff, like reinventing the browser in an immutable abstraction layer that can time travel recursively.



```html
<xtal-in>
</xtal-in>

<div>
...
<button data-dispatch-on="click: to:wtf bubbles composed noblock">How did I get here?</button>
...
</div>
<script>
document.body.addEventListener('wtf', e =>{
    alert('Same as it ever was');
})
</script>
```



By default, xtal-in clocks the original event from propagating is optional, and prevents the event from propagating.  Note that we specify whether this new semantically meaningful event should bubble and/or escape the shadow DOM cocoon ("composed")


You can also specify a test on the element spawning the event, using the if-matches attribute, which uses matches() [under the hood](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches):

```html
<div data-dispatch-on="
    click: if(#talkingButton) to:¯\_(ツ)_/¯ bubbles composed
    input: if(#large_automobile) to:behind-the-wheel
">

...

<button id="talkingButton">My God! What have I done?</button>
<input type="text" id="large_automobile">
...
</div>
```

## Monitoring Attribute Changes


In addition to listening for click or input events, one can listen for attribute change events:

```html
<david-byrne beautiful-wife="Adelle Lutz" data-dispatch-when-attributes-mutate="beautiful-wife: to:once-in-a-lifetime"></david-byrne>
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
