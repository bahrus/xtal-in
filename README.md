[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-in)

# \<xtal-in-*\>

\<xtal-in-*\> is a dependency-free suite of components that generates events with semantically meaningful, and even unique, discoverable event names.

The -in- in xtal-in- refers to an "input channel" -- which can be a clickable dom element, or more abstract things like attributes, child mutations, etc.

In the [groundbreaking blog post "Custom Elements That Work Anywhere"](http://robdodson.me/interoperable-custom-elements/), Rob Dodson blegs:

> **In general, don't bubble events unless they are semantically meaningful.** For example, *changed* is not a very semantically
> meaningful event, whereas *document-opened* would be. Non-semantic events can leak up and another element may accidentally handle them. 

Adding an event listener to an element, whose sole purpose is to bubble the event up with a different name, is a rather insulting task for the powerful and sophisticated JavaScript language to handle.  JavaScript should only be bothered with important stuff, like reinventing the browser in an immutable abstraction layer that can time travel recursively.

If a developer is looking at markup, and sees an event handler, and, heart beating in anticipation of what spectacular logic will be found there, finds that it is just reposting the event with a different name, can we fault the developer for asking if this is living, and making a mid-life career move?

This packages contains multiple elements that enable declaratively currying, as well as generating, events easily.

A number of elements, starting with prefix "xtal-in-*" serve as *sources* of events.

One particular element in this package, *add-event-listener" only listens for events, and bubbles them up with a semantic name.  Let's start diving into this last one in more detail.

Take a look at the markup below:


```html
<div>
<add-event-listener on="click" dispatch event-name="wtf" bubbles composed></add-event-listener>
...
<button>How did I get here?</button>
...
</div>
<script>
document.body.addEventListener('wtf', e =>{
    alert('Same as it ever was');
})
</script>
```

In this example, add-event-listener attaches a "click" event listener to the parent element, div in this case.  It will thus capture any click events inside the div, including the button.

In addition to spawning a new event with a semantically meaningful name ("wtf"), one can stop the propagation of the original click event by setting attribute:  stop-propagation.  Note that we specify whether this new semantically meaningful event should bubble and/or escape the shadow DOM cocoon ("composed")


You can also specify a test on the element spawning the event, using the if-matches attribute, which uses matches() [under the hood](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches):

```html
<div>
    <add-event-listener on="click" if-matches="#talkingButton" dispatch event-name="¯\_(ツ)_/¯" bubbles composed></add-event-listener>
    <add-event-listener on="input" if-matches="#large_automobile" dispatch event-name="behind-the-wheel"></xtal-in>

...
<button id="talkingButton">My God! What have I done?</button>
<input type="text" id="large_automobile">
</div>
```

For a very large application, avoiding collisions between two events that happen to adopt the same name is a little difficult, if sticking purely to declarative markup, especially compared to the power of typed supersets of JavaScript.  To solve this, you could utilize the xtal-import-export web component defined within the [webcomponents.org/element/bahrus/xtal-method](xtal-method) package.  You could import a global guid constant and export that symbol as your event-name property.

## Renaming

If the name of the custom element, add-event-listener, seems too long, or clashes with someone else's custom element with the same name, then you can rename it locally.  The same applies to all the web components defined in this package, so the following discussion is more general than just for add-event-listener.

In your head tag, add some attributes like so:

```html
<head data-xtalInAddEventListenerAlias="tl-dr">
```

Then you can use tl-dr instead of add-event-listener.


## Canonical Name

If you want to use this component in a reusable component, which includes html template markup, and which you want to release into the wild, you should refer to the "canonical" name for this component:  "xtal-in-curry," rather than the more contentious add-event-listener.



## Too soon?

Perhaps you spotted a flaw:

Being that custom elements can load asynchronously, what is to guarantee that the elements inside the event listener won't fire events *before* the custom element has attached listeners?  Unfortunately, we can't.  To prevent this from happening, we can disable those elements, and then re-enable them after the event handler has been added:

```html
<add-event-listener on="click" dispatch event-name="wtf" bubbles composed></add-event-listener>
...
<button disabled  xtal-in-able>How did I get here?</button>
```

If multiple event listeners are added, then give them all the same group.  Until all elements with the same group have been attached, the disabled attribute / property won't be removed. [TODO]

## Details, details

In some sense, this documentation is out of order.  The custom element add-event-listener described above, extends the base component, custom-event, which we've not mentioned yet (cuz it's kind of boring).  This component is also renamable, as described above.  Other names that could be more readable would be bubble-prop, or maybe prop-rebound.  It's difficult to see how you would use this component directly, but who knows?

A critical feature of [custom events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) is the ability to pass a [detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) as part of the event.

custom-event (canonical name:  xtal-in-detail) allows you to post an event any time a watched property, "detail", changes.  So in the context of a Polymer template, the markup could look as follows:

```html
<custom-event dispatch detail="[[whatIFound]]" event-name="at bottom of the ocean" bubbles composed></custom-event>
```

Now if we go back to the first web component, add-event-listener, it inherits this property, so when the button is clicked, it can pass the detail object via binding.

After the event has finished, custom-event places the (modified) detail property into the value property, which fires a value-changed event that Polymer elements can auto-bind to.

## Monitoring Attribute Changes


In addition to listening for click or input events, one can listen for attribute change events:

```html
<observe-attributes dispatch event-name="once-in-a-lifetime">
<david-byrne beautiful-wife="Adelle Lutz"></david-byrne>
</observe-attributes>
```

observe-attributes supports a "filter" attribute/property that can specify an array of specific attributes to watch.

Canonical tag name:  "xtal-in-detail"

## Monitoring Children

```html
 <observe-children dispatch event-name="childrenChanged" bubbles composed>
...
</observe-children>
```

Canonical name: xtal-in-children

## ES6 Modules or not?

This package utilizes ES6 modules.  Each custom element is a separate module, which inherits from custom-event.js.  From a developer point of view, this is great, and for modern browsers, it works great.

However, for browsers that don't support ES6 modules, an alternative file, xtal-in.js, bundles all the modules together.  It can be referenced using a classic script tag.  No require.js or any other polyfill is required.

## And now for something completely different

Most of the functionality described here involves events flowing upwards.  However, those of us who like two-way binding emulation, but who don't necessarily want to buy into a view library, can take advantage of one additional property of add-event-listener:  cascade-down.


```html
<add-event-listener on="click" dispatch event-name="wtf" bubbles composed cascade-down></add-event-listener>
...

<my-custom-element wtf-props="myProp"><my-custom-element>
```

If multiple properties need to be set to the value of the event, list them with a comma delimiter.

If trying to set property innerHTML or nodeValue, html tags will first be stripped.

## Media Queries

Another event generator is the match-media component.  This is similar to Polymer's iron-media-query, but with no legacy dependencies.

Canonical name:  xtal-in-media.

```html
<div>[[mediaDoesMatch]]</div>
<match-media media-query-string="(max-height: 300px)" value="{{mediaDoesMatch}}"></match-media>
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
