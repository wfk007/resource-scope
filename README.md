# ResourceScope

JavaScript resources auto run, collect and dispose

## Features

1. Frame independent

2. Lightweight, zero runtime dependency

3. Typescript Support


## install

```shell
$ npm install resource-scope
```

## usage

```JavaScript
import { resourceScope } from "resource-scope";

const scope = eventScope();

scope.run(() => {
  // resize
  window.addEventListener("resize", () => console.log("resize"));

  // IntersectionObserver
  const intersectionObserver = new IntersectionObserver(() =>
    console.log("IntersectionObserver"),
  );
  document.querySelectorAll("*").forEach((item) => {
    intersectionObserver.observe(item);
  });

  // setInterval
  setInterval(() => {
    console.log("setInterval");
  }, 1000);
});


scope.dispose();

```

## supported

- addEventListener

- intersectionObserver

- setInterval

- TODO...
