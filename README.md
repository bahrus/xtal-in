[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-in)

# \<xtal-in\>

\<xtal-in\> is a dependency-free component that curries events with semantically meaningful, and even unique, discoverable event names.

In the [groundbreaking blog post "Custom Elements That Work Anywhere"](http://robdodson.me/interoperable-custom-elements/), Rob Dodson blegs:

> **In general, don't bubble events unless they are semantically meaningful.** For example, *changed* is not a very semantically
> meaningful event, whereas *document-opened* would be. Non-semantic events can leak up and another element may accidentally handle them. 

Adding an event handler to an element, whose sole purpose is to bubble the event up with a different name, is a rather insulting task for the powerful and sophisticated JavaScript language to handle.  JavaScript should only be bothered with important stuff, like reinventing the browser in an immutable abstraction layer that can time travel recursively.

If a developer is looking at markup, and sees an event handler, and, heart beating in anticipation of what spectacular logic will be found there, finds that it is just reposting the event with a different name, can we fault the developer for asking if this is living, and making a mid-life career move?

This element, \<xtal-in\>, makes it easy to declaratively curry a standard click or input event into a user defined event name. One can also automatically generate a unique event name in a typesafe, discoverable way, by referring to a relative url or TypeScript filename (e.g.), which might contain a guid identifier. 

One can also declaratively configure whether the event should bubble, and if it should escape its Shadow DOM cocoon via the composed flag:


```html
<xtal-in when-click dispatch event-name="wtf" bubbles composed>
<button>How did I get here?</button>
</xtal-in>
<script>
document.body.addEventListener('wtf', e =>{
    alert('Same as it ever was');
})
</script>
```

In the example above, we wrapped a button element with the \<xtal-in\> element, and listened for clicks from within.

============================  TODO ==========================================

But wrapping everything can become unwieldly, especially if we need to do more than monitor for one event type or change.

You can alternatively specify a target by id to listen for the event:

```html
<xtal-in when-clicking-on="talkingButton" dispatch event-name="¯\_(ツ)_/¯" bubbles composed></xtal-in>
<xtal-in when-inputting-on="large_automobile" dispatch event-name="behind-the-wheel"></xtal-in>
>
...
<button id="talkingButton">My God! What have I done?</button>
<input type="text" id="large_automobile">
```

There are special reserved values the target specifying attribute (when-clicking-on, when-inputting-on) can take: _self (default), _parent (parent node), _host (most immediate containing element that has a shadow root), that can be specified, which will cause the target to be determined relative to the *xtal-in* element. 

In addition to listening for click or input events, one can listen for attribute change events:

```html
<david-byrne beautiful-wife="Adelle Lutz">
#shadow-root >
    <xtal-in when-attribute-mutates="_host@beautiful-wife" dispatch event-name="once-in-a-lifetime">
>
</david-byrne>
```

One can specify detail information to include in the custom event via the detail property:

```html
<xtal-in when-attribute-mutates="_host@money" dispatch event-name="blue-again" event-detail="[[waterFlow]]">
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
