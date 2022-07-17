import Users from '../models/users.js'
import { errorResponse, successResponse } from '../utils/responseHelper.js'

const _users = async (req, res) => {
  const { page, resultsInPage } = req.query
  try {
    const users = await Users.query().orderBy('id').page(page, resultsInPage)
    return successResponse({ data: users.results, res })
  } catch (err) {
    return errorResponse({ err, res })
  }
}

/**
 * http://localhost:5000/demo-pagination/users-with-graphs?page=0&resultsInPage=4
 *
 * WithGraphFetched - https://vincit.github.io/objection.js/api/query-builder/eager-methods.html#withgraphfetched
 * Limitations:
 * - Relations cannot be referenced in the root query because they are not joined.
 * - limit and page methods will work incorrectly when applied to a relation using modifyGraph or modifiers because
 *   they will be applied on a query that fetches relations for multiple parents. You can use limit and page for the
 *   root query.
 *
 * WithGraphJoined - https://vincit.github.io/objection.js/api/query-builder/eager-methods.html#withgraphjoined
 * Limitations:
 * - limit, page and range methods will work incorrectly because they will limit the result set that contains all the
 *   result rows in a flattened format. For example the result set of the eager expression children.children will have
 *   10 * 10 * 10 rows assuming that you fetched 10 models that all had 10 children that all had 10 children.
 */
const _usersWithGraph = async (req, res) => {
  const { page, resultsInPage } = req.query

  try {
    // const users = await Users.query()
    //   .orderBy('users.id')
    //   .withGraphFetched('other_movies')
    //   .page(page, resultsInPage)
    //   .debug()

    const users = await Users.query().orderBy('users.id').withGraphJoined('address').page(page, resultsInPage).debug()
    return successResponse({ data: users.results, res })
  } catch (err) {
    return errorResponse({ err, res })
  }
}

export { _users, _usersWithGraph }
