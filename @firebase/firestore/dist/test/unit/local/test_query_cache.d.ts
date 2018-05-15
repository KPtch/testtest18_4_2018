/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Query } from '../../../src/core/query';
import { SnapshotVersion } from '../../../src/core/snapshot_version';
import { TargetId } from '../../../src/core/types';
import { Persistence } from '../../../src/local/persistence';
import { QueryCache } from '../../../src/local/query_cache';
import { QueryData } from '../../../src/local/query_data';
import { DocumentKey } from '../../../src/model/document_key';
/**
 * A wrapper around a QueryCache that automatically creates a
 * transaction around every operation to reduce test boilerplate.
 */
export declare class TestQueryCache {
    persistence: Persistence;
    cache: QueryCache;
    constructor(persistence: Persistence, cache: QueryCache);
    start(): Promise<void>;
    addQueryData(queryData: QueryData): Promise<void>;
    updateQueryData(queryData: QueryData): Promise<void>;
    count(): number;
    removeQueryData(queryData: QueryData): Promise<void>;
    getQueryData(query: Query): Promise<QueryData | null>;
    getLastRemoteSnapshotVersion(): SnapshotVersion;
    getHighestTargetId(): TargetId;
    addMatchingKeys(keys: DocumentKey[], targetId: TargetId): Promise<void>;
    removeMatchingKeys(keys: DocumentKey[], targetId: TargetId): Promise<void>;
    getMatchingKeysForTargetId(targetId: TargetId): Promise<DocumentKey[]>;
    removeMatchingKeysForTargetId(targetId: TargetId): Promise<void>;
    containsKey(key: DocumentKey): Promise<boolean>;
    setLastRemoteSnapshotVersion(version: SnapshotVersion): Promise<void>;
}
