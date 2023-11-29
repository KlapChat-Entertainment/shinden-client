<script lang="ts">
    import { page } from "$app/stores";
    import { loadingState } from "$lib/stores";
    let animeName = $page.url.searchParams.get('animeName');

    loadingState.set("loading");
    loadingState.set("failed");
</script>

<!-- TODO: Table with search results -->
<h2>{animeName}</h2>