<script lang="ts">
  import { onMount } from "svelte";
  import { editorStore, notificationStore, actions } from "$editor/store";
  import StateNotification from "./Notifications.svelte";
  import RoomEditor from "./RoomEditor.svelte";
  import ObjectEditor from "./ObjectEditor.svelte";
  import ActionEditor from "./ActionEditor.svelte";
  import type { Room, Object, Action } from "$editor/lib/schemas";
  import { user_store } from "$lib/stores/user_store";

  // State
  let selectedObjectIndex: number | null = null;
  let selectedActionIndex: number | null = null;

  // Handle file upload
  let fileInput: HTMLInputElement;

  const handleFileUpload = async () => {
    if (!fileInput.files || fileInput.files.length === 0) {
      actions.notifications.showError("No file selected");
      return;
    }

    const file = fileInput.files[0];
    console.log("Selected file:", file.name);

    try {
      const config = await actions.config.loadConfigFromFile(file);

      if (config) {
        // Reset selection state after loading
        selectedObjectIndex = null;
        selectedActionIndex = null;
      }
    } catch (error) {
      console.error("Error in handleFileUpload:", error);
      actions.notifications.showError(
        `Failed to load file: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  };

  // Handle save
  const handleSave = () => {
    actions.config.saveConfigToFile();
  };

  // Handle publish to contract
  const handlePublish = async () => {
    await actions.config.publishToContract();
  };

  // Handle room selection
  const handleRoomSelect = (index: number) => {
    actions.rooms.setCurrentIndex(index);
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
    actions.rooms.add();
    selectedObjectIndex = null;
    selectedActionIndex = null;
  };

  // Delete the current room
  const handleDeleteRoom = () => {
    if (confirm("Are you sure you want to delete this room?")) {
      actions.rooms.delete($editorStore.currentRoomIndex);
      selectedObjectIndex = null;
      selectedActionIndex = null;
    }
  };

  // Add a new object to the current room
  const handleAddObject = () => {
    actions.objects.add();
    selectedObjectIndex =
      $editorStore.currentLevel.rooms[$editorStore.currentRoomIndex].objects
        .length - 1;
    selectedActionIndex = null;
  };

  // Delete an object from the current room
  const handleDeleteObject = (index: number) => {
    if (confirm("Are you sure you want to delete this object?")) {
      actions.objects.delete(index);
      selectedObjectIndex = null;
      selectedActionIndex = null;
    }
  };

  // Add a new action to an object
  const handleAddAction = (objectIndex: number) => {
    actions.objects.addAction(objectIndex);
    selectedActionIndex =
      $editorStore.currentLevel.rooms[$editorStore.currentRoomIndex].objects[
        objectIndex
      ].actions.length - 1;
  };

  // Delete an action from an object
  const handleDeleteAction = (objectIndex: number, actionIndex: number) => {
    if (confirm("Are you sure you want to delete this action?")) {
      actions.objects.deleteAction(objectIndex, actionIndex);
      selectedActionIndex = null;
    }
  };

  // Update a room
  const handleUpdateRoom = (room: Room) => {
    actions.rooms.update($editorStore.currentRoomIndex, room);
  };

  // Update an object
  const handleUpdateObject = (objectIndex: number, object: Object) => {
    actions.objects.update(objectIndex, object);
  };

  // Update an action
  const handleUpdateAction = (
    objectIndex: number,
    actionIndex: number,
    action: Action
  ) => {
    actions.objects.updateAction(objectIndex, actionIndex, action);
  };

  // Load the test game config on mount
  onMount(async () => {
    try {
      actions.config.initialize();
    } catch (error: unknown) {
      console.error("Error loading test game config:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      actions.notifications.showError(
        `Error loading test game config: ${errorMsg}`
      );
    }
  });
</script>

<div class="editor-container text-sm">
  <header class="p-4 flex justify-between items-center">
    <h1 class="text-xl font-bold font-mono">EDITZORG</h1>
    <div class="flex gap-2 font-semibold">
      <label class="btn btn-sm btn-success">
        Import Config
        <input
          type="file"
          accept=".json"
          bind:this={fileInput}
          on:change={handleFileUpload}
          class="hidden"
        />
      </label>
      <button class="btn btn-sm btn-success" on:click={handleSave}
        >Export Config</button
      >
      <button
        class="btn btn-sm btn-warning"
        on:click={handlePublish}
        disabled={$notificationStore.type === "publishing"}
      >
        {$notificationStore.type === "publishing"
          ? "Publishing..."
          : "Publish to Contract"}
      </button>
      <button
        class="btn"
        on:click={() => {
          $user_store.dark_mode = !$user_store.dark_mode;
        }}
      >
        {$user_store.dark_mode ? "☀️" : "🌑"}
      </button>
    </div>
  </header>

  <!-- Main Editor UI -->
  {#if !$notificationStore.blocking}
    <div class="grid grid-cols-12 gap-4">
      <!-- Room List -->
      <div class="col-span-2 bg-transparent rounded">
        <ul class="flex flex-col gap-2">
          <button class="btn btn-sm btn-primary" on:click={handleAddRoom}
            >Add Room</button
          >
          {#each $editorStore.currentLevel.rooms as room, i}
            <li class="border-gray-700 border-b">
              <button
                class="btn w-full text-left p-2 rounded"
                class:btn-active={i === $editorStore.currentRoomIndex}
                on:click={() => handleRoomSelect(i)}
              >
                {room.roomName}
              </button>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Room Editor -->
      <div class="room-inspector col-span-4 bg-gray-100">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Room</h2>
          <button class="btn btn-sm btn-danger" on:click={handleDeleteRoom}
            >❌</button
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
      <div class="object-editor col-span-3 rounded">
        {#if $editorStore.currentLevel.rooms.length > 0}
          <div class="grid grid-cols-1 gap-4">
            <ul class="flex flex-col gap-2">
              <button class="btn btn-sm btn-primary" on:click={handleAddObject}
                >Add Object</button
              >
              {#each $editorStore.currentLevel.rooms[$editorStore.currentRoomIndex].objects as object, i}
                <li>
                  <button
                    class="btn w-full text-left p-2 rounded"
                    class:btn-active={i === selectedObjectIndex}
                    on:click={() => handleObjectSelect(i)}
                  >
                    {object.type} ({object.material})
                  </button>
                </li>
              {/each}
            </ul>
            {#if selectedObjectIndex !== null}
              <div class="object-inspector bg-gray-50">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-lg font-semibold">Object</h2>
                  <button
                    class="btn btn-sm btn-danger"
                    on:click={() => {
                      if (selectedObjectIndex !== null) {
                        handleDeleteObject(selectedObjectIndex);
                      }
                    }}>❌</button
                  >
                </div>
                {#if selectedObjectIndex !== null}
                  <ObjectEditor
                    object={$editorStore.currentLevel.rooms[
                      $editorStore.currentRoomIndex
                    ].objects[selectedObjectIndex]}
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
      <div class="action-editor col-span-3 rounded">
        {#if selectedObjectIndex !== null}
          <div class="grid grid-cols-1 gap-4">
            <ul class="space-y-2 mb-4">
              {#if selectedObjectIndex !== null}
                <li>
                  <button
                    class="btn btn-sm btn-primary w-full p-2 rounded"
                    on:click={() => {
                      if (selectedObjectIndex !== null) {
                        handleAddAction(selectedObjectIndex);
                      }
                    }}>Add Action</button
                  >
                </li>
              {/if}
              {#each $editorStore.currentLevel.rooms[$editorStore.currentRoomIndex].objects[selectedObjectIndex].actions as action, i}
                <li>
                  <button
                    class="btn w-full text-left p-2 rounded"
                    class:btn-active={i === selectedActionIndex}
                    on:click={() => handleActionSelect(i)}
                  >
                    {action.type} ({action.enabled ? "Enabled" : "Disabled"})
                  </button>
                </li>
              {/each}
            </ul>
            {#if selectedActionIndex !== null && selectedObjectIndex !== null}
              <div class="action-inspector bg-gray-50">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-lg font-semibold">Action</h2>
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
                    }}>❌</button
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
          <div class="text-center text-black/20">No object selected.</div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Unified Notification -->
  {#if $notificationStore.type !== "none"}
    <StateNotification
      type={$notificationStore.type === "publishing"
        ? "loading"
        : $notificationStore.type}
      message={$notificationStore.message}
      blocking={$notificationStore.blocking}
      dismissable={!$notificationStore.blocking}
      timeout={$notificationStore.timeout || null}
      logs={$notificationStore.logs || null}
      on:dismiss={actions.notifications.clear}
    />
  {/if}
</div>
