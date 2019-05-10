import RouteStore from './RouteStore'
import { RouteDefinitions } from './types'
import { StoreContext } from '@ragg/fleur'

export const createStoreWithStaticRoutes = <R extends RouteDefinitions>(
  routes: R,
): {
  storeName: string
  new (...args: any[]): RouteStore<R>
} => {
  return class StaticRouteStore extends RouteStore<R> {
    public static storeName = 'fleur-route-store-dom/RouteStore'

    constructor(context: StoreContext) {
      super(context)
      this.routes = routes
    }
  }
}

export { HistoryHandler } from './HistoryHandler'
export { navigateOperation } from './navigateOperation'
export { RouteStore, RouteDefinitions }
export { MatchedRoute } from './types'
export { Link } from './Link'
