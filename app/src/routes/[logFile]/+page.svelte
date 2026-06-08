<script lang="ts">
  import { fileState } from "../file.svelte.js";
  let { params } = $props();

  let logs: { [key: string]: { [key: string]: string[][] } } = $state({});
  let activeService: string = $derived(Object.keys(logs)[0] ?? "");
  let activeLevel: string = $derived(Object.keys(logs[activeService] ?? {})[0] ?? "");

  $effect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/get-file?file=${params.logFile}`)
      .then((res) => {
        if (!res.ok) throw new Error("file not found");
        return res.json();
      })
      .then((data) => {
        logs = data.logs || {}
        fileState.activeFile = params.logFile;
      })
      .catch((err) => console.log(err));
  });
</script>

<div id="service-list">
  {#each Object.keys(logs) as service}
    <button
      style={activeService == service ? "background-color: var(--highlight);color: var(--bg);" : "color: var(--highlight);"}
      onclick={() => (activeService = service)}>{service}</button
    >
  {/each}
</div>
<div id="log-container">
  <ul id="level-list">
    {#each Object.keys(logs[activeService] ?? {}) as level}
      <button
        style={activeLevel == level ? `background-color: var(--${level.toLowerCase()});color: var(--bg);` : `color: var(--${level.toLowerCase()});`}
        onclick={() => (activeLevel = level)}>{level}</button
      >
    {/each}
  </ul>
  <div id="logs">
    {#each logs[activeService]?.[activeLevel] ?? [] as log}
      <div id="log-message">
        {#each log as item}
          <p>{item}</p> 
        {/each}
      </div>
    {/each}
  </div>
</div>
