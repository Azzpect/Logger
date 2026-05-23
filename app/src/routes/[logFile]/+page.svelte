<script lang="ts">
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
      .then((data) => logs = data.logs || {})
      .catch((err) => console.log(err));
  });
</script>

<div id="service-list">
  {#each Object.keys(logs) as service}
    <button
      class={activeService === service ? "active" : ""}
      onclick={() => (activeService = service)}>{service}</button
    >
  {/each}
</div>
<div id="log-container">
  <ul id="level-list">
    {#each Object.keys(logs[activeService] ?? {}) as level}
      <button
        class={activeLevel === level ? "active" : ""}
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
