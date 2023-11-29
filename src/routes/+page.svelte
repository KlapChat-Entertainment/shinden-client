<script lang="ts">
	import SubmitButton from "$lib/SubmitButton.svelte";
    import { loadingState } from "$lib/stores";
	import { onMount } from "svelte";

   
    // Example use of loading state system
    loadingState.set("loading");

    setTimeout(()=>{
        loadingState.set("success");
    }, 1000);
</script>

<div class="h-full w-full bg-no-repeat flex justify-center items-center flex-col">
    <img src="/images/elric.png" width="624px" alt="" class="drop-shadow-md">
    <form action="/search" class="flex flex-col gap-4 items-center">
        <input required placeholder="Wpisz nazwę anime" type="text" class="w-[600px] h-10 outline-none rounded-3xl px-5 py-1 shadow-md shadow-black" name="animeName">
        <SubmitButton />
    </form>
</div>