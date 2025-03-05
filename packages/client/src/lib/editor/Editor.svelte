<script lang="ts">
  import { onMount } from "svelte";
  import { editorStore, editorActions } from "./store";
  import {
    loadConfigFromFile,
    saveConfigToFile,
    validateConfig,
    formatValidationError,
    transformConfig,
  } from "./utils";
  import RoomEditor from "./RoomEditor.svelte";
  import ObjectEditor from "./ObjectEditor.svelte";
  import ActionEditor from "./ActionEditor.svelte";
  import type { Room, Object, Action } from "./types";
  import testConfig from "@zorg/generator/config/test_game.json";

  // State
  let selectedObjectIndex: number | null = null;
  let selectedActionIndex: number | null = null;
  let isLoading = false;
  let errorMessage = "";
  let successMessage = "";

  // Handle file upload
  let fileInput: HTMLInputElement;

  const handleFileUpload = async () => {
    if (!fileInput.files || fileInput.files.length === 0) {
      errorMessage = "No file selected";
      return;
    }

    const file = fileInput.files[0];
    isLoading = true;
    errorMessage = "";

    try {
      const config = await loadConfigFromFile(file);
      const errors = validateConfig(config);

      if (errors.length > 0) {
        errorMessage = `Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`;
      } else {
        editorActions.loadConfig(config);
        successMessage = "Config loaded successfully";
        setTimeout(() => {
          successMessage = "";
        }, 3000);
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      errorMessage = `Error loading config: ${errorMsg}`;
    } finally {
      isLoading = false;
    }
  };

  // Handle save
  const handleSave = () => {
    const { config, errors } = editorActions.saveConfig();

    if (errors.length > 0) {
      errorMessage = `Config has ${errors.length} validation errors. First error: ${formatValidationError(errors[0])}`;
      return;
    }

    saveConfigToFile(config);
    successMessage = "Config saved successfully";
    setTimeout(() => {
      successMessage = "";
    }, 3000);
  };

  // Handle room selection
  const handleRoomSelect = (index: number) => {
    editorActions.setCurrentRoomIndex(index);
    selectedObjectIndex = null;
    selectedActionIndex = null;
  };

  // Handle object selection
  const handleObjectSelect = (index: number) => {
    selectedObjectIndex = index;
    selectedActionIndex = null;
  };

  // Handle action selection
  const handleActionSelect = (index: number) => {
    selectedActionIndex = index;
  };

  // Add a new room
  const handleAddRoom = () => {
    editorActions.addRoom();
    selectedObjectIndex = null;
    selectedActionIndex = null;
  };

  // Delete the current room
  const handleDeleteRoom = () => {
    if (confirm("Are you sure you want to delete this room?")) {
      editorActions.deleteRoom($editorStore.currentRoomIndex);
      selectedObjectIndex = null;
      selectedActionIndex = null;
    }
  };

  // Add a new object to the current room
  const handleAddObject = () => {
    editorActions.addObject();
    selectedObjectIndex =
      $editorStore.currentLevel.rooms[$editorStore.currentRoomIndex].objects
        .length - 1;
    selectedActionIndex = null;
  };

  // Delete an object from the current room
  const handleDeleteObject = (index: number) => {
    if (confirm("Are you sure you want to delete this object?")) {
      editorActions.deleteObject(index);
      selectedObjectIndex = null;
      selectedActionIndex = null;
    }
  };

  // Add a new action to an object
  const handleAddAction = (objectIndex: number) => {
    editorActions.addAction(objectIndex);
    selectedActionIndex =
      $editorStore.currentLevel.rooms[$editorStore.currentRoomIndex].objects[
        objectIndex
      ].actions.length - 1;
  };

  // Delete an action from an object
  const handleDeleteAction = (objectIndex: number, actionIndex: number) => {
    if (confirm("Are you sure you want to delete this action?")) {
      editorActions.deleteAction(objectIndex, actionIndex);
      selectedActionIndex = null;
    }
  };

  // Update a room
  const handleUpdateRoom = (room: Room) => {
    editorActions.updateRoom($editorStore.currentRoomIndex, room);
  };

  // Update an object
  const handleUpdateObject = (objectIndex: number, object: Object) => {
    editorActions.updateObject(objectIndex, object);
  };

  // Update an action
  const handleUpdateAction = (
    objectIndex: number,
    actionIndex: number,
    action: Action
  ) => {
    editorActions.updateAction(objectIndex, actionIndex, action);
  };

  // Load the test game config on mount
  onMount(async () => {
    try {
      // Transform the test config using our Zod schema
      const config = transformConfig(testConfig);
      editorActions.loadConfig(config);
    } catch (error: unknown) {
      console.error("Error loading test game config:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      errorMessage = `Error loading test game config: ${errorMsg}`;
    }
  });
</script>

<div class="editor-container">
  <header class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <h1 class="text-xl font-bold">Game Config Editor</h1>
    <div class="flex gap-2">
      <label class="btn btn-sm btn-primary">
        Load Config
        <input
          type="file"
          accept=".json"
          bind:this={fileInput}
          on:change={handleFileUpload}
          class="hidden"
        />
      </label>
      <button class="btn btn-sm btn-success" on:click={handleSave}
        >Save Config</button
      >
    </div>
  </header>

  {#if errorMessage}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      <span class="block sm:inline">{errorMessage}</span>
      <button
        class="absolute top-0 right-0 px-4 py-3"
        on:click={() => (errorMessage = "")}
      >
        <span class="sr-only">Close</span>
        <span class="text-xl">&times;</span>
      </button>
    </div>
  {/if}

  {#if successMessage}
    <div
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
    >
      <span class="block sm:inline">{successMessage}</span>
      <button
        class="absolute top-0 right-0 px-4 py-3"
        on:click={() => (successMessage = "")}
      >
        <span class="sr-only">Close</span>
        <span class="text-xl">&times;</span>
      </button>
    </div>
  {/if}

  {#if isLoading}
    <div class="flex justify-center items-center p-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>
  {:else}
    <div class="grid grid-cols-12 gap-4 p-4">
      <!-- Room List -->
      <div class="col-span-2 bg-gray-100 p-4 rounded">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Rooms</h2>
          <button class="btn btn-sm btn-primary" on:click={handleAddRoom}
            >Add Room</button
          >
        </div>
        <ul class="space-y-2">
          {#each $editorStore.currentLevel.rooms as room, i}
            <li>
              <button
                class="w-full text-left p-2 rounded {i ===
                $editorStore.currentRoomIndex
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-200'}"
                on:click={() => handleRoomSelect(i)}
              >
                {room.roomName}
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Room Editor -->
      <div class="col-span-4 bg-gray-100 p-4 rounded">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Room Editor</h2>
          <button class="btn btn-sm btn-danger" on:click={handleDeleteRoom}
            >Delete Room</button
          >
        </div>
        {#if $editorStore.currentLevel.rooms.length > 0}
          <RoomEditor
            room={$editorStore.currentLevel.rooms[
              $editorStore.currentRoomIndex
            ]}
            on:update={(e) => handleUpdateRoom(e.detail)}
          />
        {:else}
          <p>No rooms available. Add a room to get started.</p>
        {/if}
      </div>

      <!-- Object List and Editor -->
      <div class="col-span-3 bg-gray-100 p-4 rounded">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Objects</h2>
          <button class="btn btn-sm btn-primary" on:click={handleAddObject}
            >Add Object</button
          >
        </div>
        {#if $editorStore.currentLevel.rooms.length > 0}
          <div class="grid grid-cols-1 gap-4">
            <ul class="space-y-2 mb-4">
              {#each $editorStore.currentLevel.rooms[$editorStore.currentRoomIndex].objects as object, i}
                <li>
                  <button
                    class="w-full text-left p-2 rounded {i ===
                    selectedObjectIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-white hover:bg-gray-200'}"
                    on:click={() => handleObjectSelect(i)}
                  >
                    {object.type} ({object.material})
                  </button>
                </li>
              {/each}
            </ul>
            {#if selectedObjectIndex !== null}
              <div class="bg-white p-4 rounded">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-semibold">Edit Object</h3>
                  <button
                    class="btn btn-sm btn-danger"
                    on:click={() => {
                      if (selectedObjectIndex !== null) {
                        handleDeleteObject(selectedObjectIndex);
                      }
                    }}>Delete</button
                  >
                </div>
                {#if selectedObjectIndex !== null}
                  <ObjectEditor
                    object={$editorStore.currentLevel.rooms[
                      $editorStore.currentRoomIndex
                    ].objects[selectedObjectIndex]}
                    roomNames={$editorStore.currentLevel.rooms.map(
                      (r) => r.roomName
                    )}
                    on:update={(e) => {
                      if (selectedObjectIndex !== null) {
                        handleUpdateObject(selectedObjectIndex, e.detail);
                      }
                    }}
                  />
                {/if}
              </div>
            {/if}
          </div>
        {:else}
          <p>No room selected.</p>
        {/if}
      </div>

      <!-- Action List and Editor -->
      <div class="col-span-3 bg-gray-100 p-4 rounded">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Actions</h2>
          {#if selectedObjectIndex !== null}
            <button
              class="btn btn-sm btn-primary"
              on:click={() => {
                if (selectedObjectIndex !== null) {
                  handleAddAction(selectedObjectIndex);
                }
              }}>Add Action</button
            >
          {/if}
        </div>
        {#if selectedObjectIndex !== null}
          <div class="grid grid-cols-1 gap-4">
            <ul class="space-y-2 mb-4">
              {#each $editorStore.currentLevel.rooms[$editorStore.currentRoomIndex].objects[selectedObjectIndex].actions as action, i}
                <li>
                  <button
                    class="w-full text-left p-2 rounded {i ===
                    selectedActionIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-white hover:bg-gray-200'}"
                    on:click={() => handleActionSelect(i)}
                  >
                    {action.type} ({action.enabled ? "Enabled" : "Disabled"})
                  </button>
                </li>
              {/each}
            </ul>
            {#if selectedActionIndex !== null && selectedObjectIndex !== null}
              <div class="bg-white p-4 rounded">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-semibold">Edit Action</h3>
                  <button
                    class="btn btn-sm btn-danger"
                    on:click={() => {
                      if (
                        selectedObjectIndex !== null &&
                        selectedActionIndex !== null
                      ) {
                        handleDeleteAction(
                          selectedObjectIndex,
                          selectedActionIndex
                        );
                      }
                    }}>Delete</button
                  >
                </div>
                <ActionEditor
                  action={$editorStore.currentLevel.rooms[
                    $editorStore.currentRoomIndex
                  ].objects[selectedObjectIndex].actions[selectedActionIndex]}
                  availableActions={$editorStore.currentLevel.rooms[
                    $editorStore.currentRoomIndex
                  ].objects[selectedObjectIndex].actions.map((a) => a.actionID)}
                  on:update={(e) => {
                    if (
                      selectedObjectIndex !== null &&
                      selectedActionIndex !== null
                    ) {
                      handleUpdateAction(
                        selectedObjectIndex,
                        selectedActionIndex,
                        e.detail
                      );
                    }
                  }}
                />
              </div>
            {/if}
          </div>
        {:else}
          <p>No object selected.</p>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style lang="postcss">
  @reference "tailwindcss";

  .editor-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .btn {
    @apply font-bold py-2 px-4 rounded;
  }

  .btn-sm {
    @apply py-1 px-2 text-sm;
  }
</style>
