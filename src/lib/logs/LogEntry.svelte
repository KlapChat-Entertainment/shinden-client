<script lang="ts">
    import type { LogEntry } from "./logApi";
    export let log: LogEntry;
</script>



<li class="text-white text-sm"><span class="{log.cssclass}">{log.prefix}</span> : ({log.date}) : {log.text}</li>

<style class="postcss">
    .fail {
        @apply text-red-700;
    }

    .warning {
        @apply text-yellow-300;
    }

    .success {
        @apply text-green-700;
    }

    .info {
        @apply text-blue-400;
    }

    .other {
        @apply text-purple-700;
    }


</style>