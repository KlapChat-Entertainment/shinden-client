<script lang="ts">
	import SubmitButton from "$lib/SubmitButton.svelte";
</script>

<div class="h-full w-full bg-no-repeat flex justify-center items-center flex-col">
    <img src="/images/elric.png" width="624px" alt="" class="drop-shadow-md">
    <form action="" class="flex flex-col gap-4 items-center">
        <input placeholder="Wpisz nazwę anime" type="text" class="w-[600px] h-10 outline-none rounded-3xl px-5 py-1 shadow-md shadow-black">
        <SubmitButton />
    </form>
</div>