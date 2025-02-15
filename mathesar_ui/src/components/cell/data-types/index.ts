import string from './string';
import boolean from './boolean';
import number from './number';
import uri from './uri';
import duration from './duration';
import date from './date';
import time from './time';
import datetime from './datetime';
import type { CellDataType, CellComponentFactory } from './typeDefinitions';

const dataTypeComponentFactories: Record<CellDataType, CellComponentFactory> = {
  string,
  boolean,
  number,
  uri,
  duration,
  date,
  time,
  datetime,
};

export default dataTypeComponentFactories;
