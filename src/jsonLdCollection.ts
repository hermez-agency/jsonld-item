import {
  BaseJsonLdItemInterface,
  JsonLdIri,
  JsonLDItem,
  JsonLdType,
} from "@/jsonLDItem"
import { createJsonLd } from "@/createJsonLd"

interface JsonLdCollectionBase extends BaseJsonLdItemInterface {
  "@id": JsonLdIri
  "@type": JsonLdType
  "@context"?: string
}

/**
 * Collection without the `hydra:` prefix, as returned by API Platform 4.
 */
export interface JsonLdMemberCollection<
  T = BaseJsonLdItemInterface,
> extends JsonLdCollectionBase {
  member: JsonLDItem<T>[]
  totalItems?: number
}

/**
 * Collection with the `hydra:` prefix, as returned by API Platform 3.
 */
export interface JsonLdHydraMemberCollection<
  T = BaseJsonLdItemInterface,
> extends JsonLdCollectionBase {
  "hydra:member": JsonLDItem<T>[]
  "hydra:totalItems"?: number
}

/**
 * A Hydra collection, with or without the `hydra:` prefix.
 */
export type JsonLdCollection<T = BaseJsonLdItemInterface> =
  JsonLdMemberCollection<T> | JsonLdHydraMemberCollection<T>

export function createJsonLdCollection<T = BaseJsonLdItemInterface>({
  type,
  member,
}: {
  type: JsonLdType
  member?: JsonLDItem<T>[]
}): JsonLdMemberCollection<T> {
  return createJsonLd<JsonLdMemberCollection<T>>({
    type,
    object: {
      "@id": type,
      "@context": type,
      "@type": "Collection",
      member: member ?? [],
      totalItems: (member ?? []).length,
    },
  })
}

/**
 * Members of a collection, whether it uses `member` or `hydra:member`.
 */
export function getItems<T = JsonLDItem<any>>(
  collection: JsonLdCollection<T>
): JsonLDItem<T>[] {
  return collection?.member ?? collection?.["hydra:member"] ?? []
}
