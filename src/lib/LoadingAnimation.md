# Instructions for using the loading state system

There are three loading states

- LOADING
- SUCCESS
- FAILED
- WARNING

Each script in the .svelte file should start with a

```ts
import { loadingState } from "./stores";
import { LoadingState } from "./types";
$loadingState = LoadingState.LOADING;
```

And then after loading the necessary information, it should set the state depending on the result.

For example

```ts
$loadingState = LoadingState.LOADING;

setTimeout(()=>{
    $loadingState = LoadingState.SUCCESS;
}, 1000);
```
