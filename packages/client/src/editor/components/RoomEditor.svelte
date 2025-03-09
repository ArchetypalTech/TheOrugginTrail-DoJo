<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { Room } from "$editor/lib/schemas";
  import { ROOM_TYPE_OPTIONS, BIOME_TYPE_OPTIONS } from "$editor/lib/types";

  export let room: Room;

  const dispatch = createEventDispatcher<{ update: Room }>();

  // Create a copy of the room for editing
  let editedRoom: Room;

  // Initialize the edited room and extract description text
  onMount(() => {
    editedRoom = { ...room };
  });

  // Update the edited room when the room prop changes
  $: if (room && (!editedRoom || room.roomID !== editedRoom.roomID)) {
    editedRoom = { ...room };
  }

  // Update the room when inputs change
  function handleChange() {
    dispatch("update", editedRoom);
  }
</script>

<div class="space-y-4">
  <div class="form-group">
    <label for="roomName" class="block text-sm font-medium text-gray-700"
      >Room Name</label
    >
    <input
      type="text"
      id="roomName"
      bind:value={editedRoom.roomName}
      on:input={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>

  <div class="form-group">
    <label for="roomDescription" class="block text-sm font-medium text-gray-700"
      >Room Description</label
    >
    <textarea
      id="roomDescription"
      bind:value={editedRoom.roomDescription.text}
      on:input={handleChange}
      rows="4"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    ></textarea>
    <div class="text-xs flex flex-col hover:text-black/40 text-black/0">
      <div class="text-nowrap">id: {editedRoom.roomDescription.id}</div>
      <div class="text-nowrap">owner: {editedRoom.roomDescription.owner}</div>
    </div>
  </div>

  <div class="form-group">
    <label for="roomType" class="block text-sm font-medium text-gray-700"
      >Room Type</label
    >
    <select
      id="roomType"
      bind:value={editedRoom.roomType}
      on:input={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      {#each ROOM_TYPE_OPTIONS as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <div class="form-group">
    <label for="biomeType" class="block text-sm font-medium text-gray-700"
      >Biome Type</label
    >
    <select
      id="biomeType"
      bind:value={editedRoom.biomeType}
      on:input={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      {#each BIOME_TYPE_OPTIONS as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <div class="form-group">
    <label for="roomID" class="block text-sm font-medium text-gray-700"
      >Room ID</label
    >
    <input
      type="text"
      id="roomID"
      bind:value={editedRoom.roomID}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      disabled
      readonly
    />
    <p class="mt-1 text-xs text-gray-500">
      This ID is generated automatically and should not be changed.
    </p>
  </div>
</div>
