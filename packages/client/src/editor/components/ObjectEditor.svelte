<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { Object } from "$editor/lib/types";
  import {
    OBJECT_TYPE_OPTIONS,
    MATERIAL_TYPE_OPTIONS,
    DIRECTION_OPTIONS,
  } from "$editor/lib/types";
  import { editorActions } from "$editor/store";

  export let object: Object;

  const dispatch = createEventDispatcher<{ update: Object }>();

  // Create a copy of the object for editing
  let editedObject: Object;

  // Initialize the edited object when the component mounts
  onMount(() => {
    editedObject = { ...object };
  });

  // Update the edited object when the object prop changes
  $: if (object && (!editedObject || object.objID !== editedObject.objID)) {
    editedObject = { ...object };
  }

  // Update the object when inputs change
  function handleChange() {
    dispatch("update", editedObject);
  }
</script>

<div class="space-y-4">
  <div class="form-group">
    <label for="objectType" class="block text-sm font-medium text-gray-700"
      >Object Type</label
    >
    <select
      id="objectType"
      bind:value={editedObject.type}
      on:change={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      {#each OBJECT_TYPE_OPTIONS as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <div class="form-group">
    <label for="material" class="block text-sm font-medium text-gray-700"
      >Material</label
    >
    <select
      id="material"
      bind:value={editedObject.material}
      on:change={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      {#each MATERIAL_TYPE_OPTIONS as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <div class="form-group">
    <label for="objDescription" class="block text-sm font-medium text-gray-700"
      >Object Description</label
    >
    <textarea
      id="objDescription"
      bind:value={editedObject.objDescription.text}
      on:input={handleChange}
      rows="3"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    ></textarea>
    <div class="text-xs flex flex-col hover:text-black/40 text-black/0">
      <div class="text-nowrap">id: {editedObject.objDescription.id}</div>
      <div class="text-nowrap">owner: {editedObject.objDescription.owner}</div>
    </div>
  </div>

  <div class="form-group">
    <label for="direction" class="block text-sm font-medium text-gray-700"
      >Direction</label
    >
    <select
      id="direction"
      bind:value={editedObject.direction}
      on:change={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      {#each DIRECTION_OPTIONS as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <div class="form-group">
    <label for="destination" class="block text-sm font-medium text-gray-700"
      >Destination</label
    >
    <select
      id="destination"
      bind:value={editedObject.destination}
      on:change={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      disabled={editedObject.direction === "None"}
    >
      <option value={null}>None</option>
      {#each editorActions.getAllRooms() as room}
        <option value={room.roomID}>{room.roomName}</option>
      {/each}
    </select>
    <p class="mt-1 text-xs text-gray-500">
      {editedObject.direction === "None"
        ? "Set a direction to enable destination selection."
        : "Select a room as the destination for this object."}
    </p>
  </div>

  <div class="form-group">
    <label for="objID" class="block text-sm font-medium text-gray-700"
      >Object ID</label
    >
    <input
      type="text"
      id="objID"
      bind:value={editedObject.objID}
      on:input={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      readonly
    />
    <p class="mt-1 text-xs text-gray-500">
      This ID is generated automatically and should not be changed.
    </p>
  </div>
</div>
