/*
 * Copyright 2019 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  getPreviousItem,
  getNextItem,
  updateHistoryItemIssues,
  updateHistoryItemLaunchAttributes,
  getFormattedPageLocation,
} from './utils';

describe('log/utils', () => {
  const itemsArray = [{ id: 0 }, { id: 1 }, { id: 2 }];

  describe('getPreviousItem', () => {
    test('should return null in case of item array length < 2', () => {
      expect(getPreviousItem([], 1)).toBe(null);
      expect(getPreviousItem([{ id: 1 }], 1)).toBe(null);
    });
    test('should return null if the first item is active', () => {
      expect(getPreviousItem(itemsArray, 0)).toBe(null);
    });
    test('should return item if active item index > 0', () => {
      expect(getPreviousItem(itemsArray, 1)).toEqual({ id: 0 });
      expect(getPreviousItem(itemsArray, 2)).toEqual({ id: 1 });
    });
  });

  describe('getNextItem', () => {
    test('should return null in case of item array length <= 1', () => {
      expect(getNextItem([], 0)).toBe(null);
      expect(getNextItem([{ id: 0 }, 0])).toBe(null);
    });
    test('should return null if the last item is active', () => {
      expect(getNextItem(itemsArray, 2)).toBe(null);
    });
    test('should return item if active item is not last', () => {
      expect(getNextItem(itemsArray, 0)).toEqual({ id: 1 });
      expect(getNextItem(itemsArray, 1)).toEqual({ id: 2 });
    });
  });

  describe('updateHistoryItemIssues', () => {
    const items = [{ id: 1, issue: { key: 'issue' } }, { id: 2 }];

    test('should return empty array in case of empty parameters', () => {
      expect(updateHistoryItemIssues()).toEqual([]);
    });
    test('should return initial items in case of unknown item id', () => {
      expect(
        updateHistoryItemIssues(items, [{ testItemId: 3, issue: { key: 'newIssue' } }]),
      ).toEqual(items);
    });
    test('should return updated items in case of correct payload', () => {
      const expectedItems = [
        { id: 1, issue: {} },
        { id: 2, issue: { key: 'newIssue' } },
      ];

      expect(
        updateHistoryItemIssues(items, [
          { testItemId: 1, issue: {} },
          { testItemId: 2, issue: { key: 'newIssue' } },
        ]),
      ).toEqual(expectedItems);
    });
  });

  describe('updateHistoryItemLaunchAttributes', () => {
    const items = [{ launchId: 1 }, { launchId: 2 }];

    test('should return empty array in case of empty parameters', () => {
      expect(updateHistoryItemLaunchAttributes()).toEqual([]);
    });
    test('should return initial items in case of mismatch of launchIds', () => {
      expect(updateHistoryItemLaunchAttributes(items, { id: 3 })).toEqual(items);
    });
    test('should return updated items in case of matching launchIds', () => {
      const expectedItems = [
        { launchId: 1 },
        { launchId: 2, launchAttributes: [{ key: 'attrKey', value: 'attrValue' }] },
      ];

      expect(
        updateHistoryItemLaunchAttributes(items, {
          id: 2,
          attributes: [{ key: 'attrKey', value: 'attrValue' }],
        }),
      ).toEqual(expectedItems);
    });
  });

  describe('getFormattedPageLocation', () => {
    const data = [{ '3995': 1 }, { '3996': 1 }, { '40981': 2 }];
    const expectedRes = [
      ['3995', 1],
      ['3996', 2],
    ];
    test('should return empty array in case of matching locations data', () => {
      expect(getFormattedPageLocation()).toEqual([]);
    });
    test('should return formatted locations', () => {
      expect(getFormattedPageLocation(data)).toEqual(expectedRes);
    });
  });
});
