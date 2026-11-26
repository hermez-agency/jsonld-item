import { describe, expect, expectTypeOf, it } from "vitest"
import {
  createJsonLdCollection,
  getItems,
  JsonLdCollection,
} from "@/jsonLdCollection"

type Article = { title: string }

const first = { "@id": "/api/articles/1", "@type": "Article", title: "First" }
const second = { "@id": "/api/articles/2", "@type": "Article", title: "Second" }

describe("getItems", () => {
  it("returns the members of a collection without prefix (API Platform 4)", () => {
    const collection: JsonLdCollection<Article> = {
      "@id": "/api/articles",
      "@type": "Collection",
      member: [first, second],
      totalItems: 2,
    }

    expect(getItems(collection)).toEqual([first, second])
  })

  it("returns the members of a hydra: prefixed collection (API Platform 3)", () => {
    const collection: JsonLdCollection<Article> = {
      "@id": "/api/articles",
      "@type": "hydra:Collection",
      "hydra:member": [first, second],
      "hydra:totalItems": 2,
    }

    expect(getItems(collection)).toEqual([first, second])
  })

  it("returns an empty array for an empty collection, in both formats", () => {
    expect(
      getItems({ "@id": "/api/articles", "@type": "Collection", member: [] })
    ).toEqual([])
    expect(
      getItems({
        "@id": "/api/articles",
        "@type": "hydra:Collection",
        "hydra:member": [],
      })
    ).toEqual([])
  })

  it("returns the members of a collection built by createJsonLdCollection", () => {
    const collection = createJsonLdCollection<Article>({
      type: "/api/articles",
      member: [first],
    })

    expect(getItems(collection)).toEqual([first])
  })

  it("types the members from either format", () => {
    expectTypeOf(
      getItems<Article>({
        "@id": "/api/articles",
        "@type": "hydra:Collection",
        "hydra:member": [first],
      })[0].title
    ).toEqualTypeOf<string>()
  })
})
