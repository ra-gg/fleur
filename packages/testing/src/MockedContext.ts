import { MockStore, mockStore } from './mockStore'
import immer, { Draft } from 'immer'
import { StoreClass, Store } from '@fleur/fleur'

type ExtractState<T extends StoreClass<any>> = T extends StoreClass<infer R>
  ? R
  : never

interface StoreDeriver {
  <T extends StoreClass>(
    store: T,
    modifier:
      | ((state: Draft<ExtractState<T>>) => void)
      | Partial<ExtractState<T>>,
  ): void
}

export class MockedContext {
  public stores: MockStore[] = []

  constructor(stores: MockStore[]) {
    this.stores = stores
  }

  public getStore<T extends StoreClass<any>>(StoreClass: T): InstanceType<T> {
    if (!StoreClass.storeName || StoreClass.storeName === '')
      throw new Error(`Store.storeName must be defined in ${Store.name}`)

    const store = this.stores.find(entry => entry.name === StoreClass.storeName)
    if (!store) throw new Error(`Store \`${StoreClass.storeName}\` not found`)

    return store.store as any
  }

  public derive(
    modifier?: ({ deriveStore: derive }: { deriveStore: StoreDeriver }) => void,
  ): this {
    const cloneStores = this.stores.map(entry =>
      mockStore(entry.StoreClass, entry.store.state),
    )

    const stores = immer(cloneStores, mockStores => {
      const storeDeriver: StoreDeriver = (StoreClass, modifier) => {
        const mock = mockStores.find(
          entry => entry.name === StoreClass.storeName,
        )

        if (!mock) {
          throw new Error(`Reference unmocked store ${StoreClass.storeName}`)
        }

        if (typeof modifier === 'function') {
          mock.store.state = immer(mock.store.state, (draft: any) => {
            modifier(draft)
          })
        } else {
          mock.store.state = { ...mock.store.state, ...modifier }
        }
      }

      if (modifier) {
        modifier({ deriveStore: storeDeriver })
      }
    })

    return new (this.constructor as any)(stores)
  }
}
