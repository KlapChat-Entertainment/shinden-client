# Instructions for using the loading state system

There are three loading states

- loading
- success
- failed
- warning

Each script in the +page.svelte file and functions should start with a 

```ts
import { loadingState } from "$lib/stores";
$loadingState = "loading";
```

And then after loading the necessary information, it should set the state depending on the result.

For example

```ts
$loadingState = "loading";

setTimeout(()=>{
    $loadingState = "success";
}, 1000);
```
