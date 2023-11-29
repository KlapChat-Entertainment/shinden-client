<script lang="ts">
    import { loadingState } from "./stores";
    import { page } from "$app/stores";
</script>

<div class="w-9 h-9 flex items-center justify-center font-bold text-lg">
    {#if $loadingState == "loading"}
        <svg version="1.1" id="L9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve">
            <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
            <animateTransform 
                attributeName="transform" 
                attributeType="XML" 
                type="rotate"
                dur="1s" 
                from="0 50 50"
                to="360 50 50" 
                repeatCount="indefinite" />
            </path>
        </svg>   
    {:else if $loadingState == "failed"}
        <span class="text-red-700">&cross;</span>
    {:else if $loadingState == "success"}
        <span class="text-green-700">&check;</span>
    {:else if $loadingState == "warning"}
        <span>&#9888;</span>
    {:else}
        <span class="text-red-700">&cross;</span>
    {/if}
</div>
