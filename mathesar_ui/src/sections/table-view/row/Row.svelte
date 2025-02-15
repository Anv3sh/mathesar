<script lang="ts">
  import { getContext } from 'svelte';
  import { getCellKey } from '@mathesar/stores/table-data';
  import type {
    TabularDataStore,
    Row,
  } from '@mathesar/stores/table-data/types';
  import { getRowKey } from '@mathesar/stores/table-data';
  import RowControl from './RowControl.svelte';
  import RowCell from './RowCell.svelte';
  import GroupHeader from './GroupHeader.svelte';
  import RowPlaceholder from './RowPlaceholder.svelte';
  import type { ProcessedTableColumnMap } from '../utils';

  export let row: Row;
  export let style: { [key: string]: string | number };
  export let processedTableColumnsMap: ProcessedTableColumnMap;

  const tabularData = getContext<TabularDataStore>('tabularData');

  $: ({ recordsData, columnsDataStore, meta, display } = $tabularData);
  $: ({ columnPositions, columnWidths } = display);
  $: rowWidthStore = display.rowWidth;
  $: rowWidth = $rowWidthStore;
  $: ({
    selectedRows,
    rowStatus,
    rowCreationStatus,
    cellModificationStatus,
    cellClientSideErrors,
  } = meta);
  $: ({ grouping } = recordsData);

  function calculateStyle(_style: { [key: string]: string | number }) {
    if (!_style) {
      return '';
    }
    return (
      `position:${_style.position};left:${_style.left}px;` +
      `top:${_style.top}px;height:${_style.height}px;` +
      `width:${rowWidth as number}px`
    );
  }

  $: styleString = calculateStyle(style);
  $: ({ primaryKeyColumnId } = $columnsDataStore);
  $: rowKey = getRowKey(row, primaryKeyColumnId);
  $: creationStatus = $rowCreationStatus.get(rowKey)?.state;
  $: status = $rowStatus.get(rowKey);
  $: wholeRowState = status?.wholeRowState;
  $: isSelected = $selectedRows.has(rowKey);
  $: hasWholeRowErrors = wholeRowState === 'failure';
  /** Including whole row errors and individual cell errors */
  $: hasAnyErrors = !!status?.errorsFromWholeRowAndCells?.length;

  function checkAndCreateEmptyRow() {
    if (row.isAddPlaceholder) {
      void recordsData.addEmptyRecord();
    }
  }
</script>

<div
  class="row"
  class:selected={isSelected}
  class:processing={wholeRowState === 'processing'}
  class:failed={hasWholeRowErrors}
  class:created={creationStatus === 'success'}
  class:add-placeholder={row.isAddPlaceholder}
  class:new={row.isNew}
  class:is-group-header={row.isGroupHeader}
  class:is-add-placeholder={row.isAddPlaceholder}
  style={styleString}
  data-identifier={row.identifier}
  on:mousedown={checkAndCreateEmptyRow}
>
  {#if row.isNewHelpText}
    <RowPlaceholder {rowWidth} />
  {:else if row.isGroupHeader && $grouping && row.group}
    <GroupHeader {row} {rowWidth} grouping={$grouping} group={row.group} />
  {:else if row.record}
    <RowControl
      {primaryKeyColumnId}
      {row}
      {meta}
      {recordsData}
      {isSelected}
      hasErrors={hasAnyErrors}
    />

    {#each [...processedTableColumnsMap] as [columnId, processedColumn] (columnId)}
      <RowCell
        {display}
        {row}
        rowIsSelected={isSelected}
        rowHasErrors={hasWholeRowErrors}
        key={getCellKey(rowKey, columnId)}
        modificationStatusMap={cellModificationStatus}
        clientSideErrorMap={cellClientSideErrors}
        bind:value={row.record[columnId]}
        {processedColumn}
        {recordsData}
        columnWidth={$columnWidths.get(columnId)}
        columnPosition={$columnPositions.get(columnId)}
      />
    {/each}
  {/if}
</div>

<style global lang="scss">
  @import 'Row.scss';
</style>
