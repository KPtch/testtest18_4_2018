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
import { Query } from '../core/query';
import { DocumentMap } from '../model/collections';
import { MaybeDocument } from '../model/document';
import { DocumentKey } from '../model/document_key';
import { PersistenceTransaction } from './persistence';
import { PersistencePromise } from './persistence_promise';
/**
 * Represents cached documents received from the remote backend.
 *
 * The cache is keyed by DocumentKey and entries in the cache are MaybeDocument
 * instances, meaning we can cache both Document instances (an actual document
 * with data) as well as NoDocument instances (indicating that the document is
 * known to not exist).
 */
export interface RemoteDocumentCache {
    /**
     * Adds or replaces an entry in the cache.
     *
     * The cache key is extracted from `maybeDocument.key`. If there is already a
     * cache entry for the key, it will be replaced.
     *
     * @param maybeDocument A Document or NoDocument to put in the cache.
     */
    addEntry(transaction: PersistenceTransaction, maybeDocument: MaybeDocument): PersistencePromise<void>;
    /** Removes the cached entry for the given key (no-op if no entry exists). */
    removeEntry(transaction: PersistenceTransaction, documentKey: DocumentKey): PersistencePromise<void>;
    /**
     * Looks up an entry in the cache.
     *
     * @param documentKey The key of the entry to look up.
     * @return The cached Document or NoDocument entry, or null if we have nothing
     * cached.
     */
    getEntry(transaction: PersistenceTransaction, documentKey: DocumentKey): PersistencePromise<MaybeDocument | null>;
    /**
     * Executes a query against the cached Document entries.
     *
     * Implementations may return extra documents if convenient. The results
     * should be re-filtered by the consumer before presenting them to the user.
     *
     * Cached NoDocument entries have no bearing on query results.
     *
     * @param query The query to match documents against.
     * @return The set of matching documents.
     */
    getDocumentsMatchingQuery(transaction: PersistenceTransaction, query: Query): PersistencePromise<DocumentMap>;
}
