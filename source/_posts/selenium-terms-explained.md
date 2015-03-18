title: "Selenium Terms Explained"
date: 2015-03-18 10:05:32
tags: Selenium, Testing
---

Selenium was pretty confusing for me at the beginning, too many terms, Selenium RC, Selenium WebDriver, RemoteWebDriver, chromedriver, firefoxdriver, Selenium Server, selenium-server-standalone, Selenium Grid, language bindings, etc. So I'll try to explain them from my perspective here, in short, hope it can be helpful to others searching around.

# Selenium RC

Selenium project was started by Jason Huggins in 2004 at ThoughtWorks. 

Its initial design was based on pure JavaScript, means it uses JavaScirpt to control browser and simulate user interaction. How does that work? Well, for example, how would you do to use jQuery to fill a input then click a button? You may write it like this:

```js
$('#inputId').val('hello world');
$('#btnId').click();
```

That's the basic idea, simplified. By so far Selenium is just a bunch of JavaScript scripts, which is called Selenium Core, it has to be loaded along with your tests and application in target browsers.

Then there is Selenium RC, RC as Remote Control. With RC, an HTTP proxy was introduced. It receives HTTP requests, intercepts commands, launches browsers, injects Selenium Core into browsers, runs tests based on intercepted commands and returns results. With this architecture, tests could be written in any languages, as long as it can send HTTP requests to the proxy. Those libraries providing the interface for specific language are referred to as bindings. Beside multiple language support, another benefit of this architecture is that now you can run your tests on Mac against IE browser on Windows, the test client and RC proxy can be deployed separately.

Here is an architecture diagram:

![rc-architecture.png](/images/selenium-terms-explained/rc-architecture.png)

The proxy also solves the same origin policy restriction, so the Selenium Core and your tests won't have to be hosted in the same server with your application, here is an anatomy:

![rc-anatomy.jpg](/images/selenium-terms-explained/rc-anatomy.jpg)

# Selenium WebDriver

Selenium RC served its purpose for several years, but it has a lot shortcomings. simulate the user by JavaScript is not reliable, different browsers or even different versions of the same browser may have different behaviors. Because browser security limitations, some simulation are not even possible, for example, controlling a file input inside a form. This is why WebDriver rises.

WebDriver uses a very different approach vs JavaScript implementation, it talks directly to browsers use the 'native' method for the browser and operating system, so it interacts like a real user without any security restrictions. How the communication made to the browser may vary depends on the browser and os your are using. So for each browser, there is a library as its 'driver', for instance, chromedriver, firefoxdriver, etc.

Here is an architecture diagram:

![webdriver-architecture.jpg](/images/selenium-terms-explained/webdriver-architecture.jpg)

Basically, bindings send commands across the common WebDriver API with WebDriver wire protocol, on the other side, the driver intercepts those commands and execute them on the actual browser and then returns the result all the way back. 

There is a protocol for communication between bindings and drivers, known as JSON Wire Protocol or WebDriver wire protocol, it's JSON based and it's restful, you can find its definition [here](https://code.google.com/p/selenium/wiki/JsonWireProtocol). So very like Selenium RC, it's still client-server architecture and still supports multiple language bindings.

Speaking of server, drivers often have built in support, means drivers can directly start as a REST server and listen for commands, like chromedriver and phantomjs. 

There is also a Java based Selenium server, it listens for commands, start the driver and transfer those commands to the driver, it's more like a proxy between the two. The benefits of using a Selenium server is that is can manage multiple browsers in different versions and implementations, and it support distributed grid deployment. One server can be run in standalone mode, grid hub mode or grid node mode, where node holds actual works, hub is just a router. 

Nodes can be configured with different capabilities, including browser type, browser version and os type, etc. Then a client using a binding can declare what capabilities it want to use to run its tests, Hub will dispatch the requirements accordingly. Hub and nodes can run on different machines, so it's possible to deploy a grid support both Windows IE and OSX Safari, then all a client needs to know is where the hub is.

Communication among these parts may look like this:

```
Bindings <-> Selenium Server: Hub <-> Selenium Server: Nodes <-> Drivers <-> Browsers
```

Complicated, right? This can be overwhelmed for beginners like me.
 
In 2009, it was announced that RC and WebDriver will be merged together. Means you can still use all those language bindings connect to a Selenium server, but how a Selenium controls browsers has changed from using Selenium Core to using WebDriver.

By now you have Selenium 2.0 = Selenium 1.0 + WebDriver, Selenium 2.0 use WebDriver and it's a upgrade of Selenium RC, the first version of Selenium.

# Let's Clarify These Terms

- Selenium Core is the first implementation to control the browser, consisted of a set of JavaScript scripts.
- Selenium RC is the client-proxy architecture along with languages bindings for Selenium Core.
- Selenium WebDriver do the same job RC did in different way, besides the client-server architecture, all kinds of languages bindings, it also includes a set of individual browser drivers.
- WebDriver Server is the REST interfaces support WebDriver wire protocol, it usually is started by a specific driver. When receiving commands, it executes them on real browser.
- Selenium Server refers to the Java based application running in standalone, grid node or grid hub mode, which can manage others drivers. It's a bonus, you may not need it to start working.
- Remote WebDriver means the WebDriver being used remotely through a wire protocol, that's exactly what we have been talking. I guess it can also be used locally as library call, I didn't look into it. 

The confusion is, these terms are too similar to each other, and many of them have multiple meanings, but after understanding what they actually are, it should be easy to tell which one is it according to the context.

WebDriver and RemoteWebDriver are also used as class/interface names in some language bindings.

Anyway, Selenium RC has been officially deprecated, if you read about it, you can choose to skip it to save your time.

# Summary

In this post, I tried to explain those confusing Selenium terms, I'll write another post about how to actually use Selenium for automated testing later.

# References

- [The Architecture Of Open Source Applications - Selenium WebDriver](http://www.aosabook.org/en/selenium.html)
- [Understanding Selenium/RC, Webdriver Architecture and developing the page object test automation framework
](http://www.slideshare.net/AtirekGupta/selenium-workshop-34820044)
- [Selenium Lesson 3 – Selenium Webdriver Architecture](http://qeworks.com/selenium-webdriver-architecture/)
