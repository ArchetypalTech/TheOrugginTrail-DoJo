<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { Action } from "$editor/lib/schemas";
  import { ACTION_TYPE_OPTIONS } from "$editor/lib/types";
  import { actions } from "$editor/store";

  export let action: Action;
  export let availableActions: string[] = [];

  const dispatch = createEventDispatcher<{ update: Action }>();

  // Create a copy of the action for editing
  let editedAction: Action;

  // Initialize the edited action when the component mounts
  onMount(() => {
    editedAction = { ...action };
  });

  // Update the edited action when the action prop changes
  $: if (
    action &&
    (!editedAction || action.actionID !== editedAction.actionID)
  ) {
    editedAction = { ...action };
  }

  // Update the action when inputs change
  function handleChange() {
    dispatch("update", editedAction);
  }
</script>

<div class="space-y-4">
  <div class="form-group">
    <label for="actionType" class="block text-sm font-medium text-gray-700"
      >Action Type</label
    >
    <select
      id="actionType"
      bind:value={editedAction.type}
      on:change={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      {#each ACTION_TYPE_OPTIONS as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <div class="form-group">
    <label for="dBitText" class="block text-sm font-medium text-gray-700"
      >Description Text</label
    >
    <textarea
      id="dBitText"
      bind:value={editedAction.dBitText}
      on:input={handleChange}
      rows="3"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    ></textarea>
    <p class="mt-1 text-xs text-gray-500">
      This text describes what happens when the action is performed.
    </p>
  </div>

  <div class="form-group flex items-center">
    <input
      type="checkbox"
      id="enabled"
      bind:checked={editedAction.enabled}
      on:change={handleChange}
      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <label for="enabled" class="ml-2 block text-sm text-gray-700">Enabled</label
    >
  </div>

  <div class="form-group flex items-center">
    <input
      type="checkbox"
      id="revertable"
      bind:checked={editedAction.revertable}
      on:change={handleChange}
      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <label for="revertable" class="ml-2 block text-sm text-gray-700"
      >Revertable</label
    >
  </div>

  <div class="form-group flex items-center">
    <input
      type="checkbox"
      id="dBit"
      bind:checked={editedAction.dBit}
      on:change={handleChange}
      class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />
    <label for="dBit" class="ml-2 block text-sm text-gray-700">dBit</label>
  </div>

  <div class="form-group">
    <label for="affectsAction" class="block text-sm font-medium text-gray-700"
      >Affects Action</label
    >
    <select
      id="affectsAction"
      bind:value={editedAction.affectsAction}
      on:change={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
    >
      <option value={null}>None</option>
      {#each actions.objects
        .getAllActionIDs()
        .filter((id) => id !== editedAction.actionID) as actionId}
        <option value={actionId}>{actionId}</option>
      {/each}
    </select>
    <p class="mt-1 text-xs text-gray-500">
      Select an action that this action affects, if any.
    </p>
  </div>

  <div class="form-group">
    <label for="actionID" class="block text-sm font-medium text-gray-700"
      >Action ID</label
    >
    <input
      type="text"
      id="actionID"
      bind:value={editedAction.actionID}
      on:input={handleChange}
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      disabled
      readonly
    />
    <p class="mt-1 text-xs text-gray-500">
      This ID is generated automatically and should not be changed.
    </p>
  </div>
</div>
