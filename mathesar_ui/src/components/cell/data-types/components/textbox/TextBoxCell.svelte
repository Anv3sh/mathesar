<script lang="ts">
  import { TextInput, optionalNonNullable } from '@mathesar-component-library';
  import SteppedInputCell from '../SteppedInputCell.svelte';
  import type { TextBoxCellProps } from '../typeDefinitions';

  type $$Props = TextBoxCellProps;

  export let isActive: $$Props['isActive'];
  export let value: $$Props['value'] = undefined;
  export let disabled: $$Props['disabled'];

  // Db options
  export let length: $$Props['length'] = undefined;
</script>

<SteppedInputCell
  {value}
  {isActive}
  {disabled}
  let:handleInputBlur
  let:handleInputKeydown
  on:movementKeyDown
  on:activate
  on:update
>
  <TextInput
    focusOnMount={true}
    maxlength={optionalNonNullable(length)}
    {disabled}
    bind:value
    on:blur={handleInputBlur}
    on:keydown={handleInputKeydown}
  />
</SteppedInputCell>
