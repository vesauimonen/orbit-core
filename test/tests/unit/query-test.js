import Query from 'orbit/query';
import { queryExpression as oqe } from 'orbit/query/expression';

///////////////////////////////////////////////////////////////////////////////

module('Orbit', function() {
  module('Query', function() {
    test('it exists', function(assert) {
      let query = new Query();
      assert.ok(query);
    });

    test('it is assigned an `id`', function(assert) {
      let query = new Query();
      assert.ok(query.id, 'query has an id');
    });

    test('can be created from with all attributes specified as options', function(assert) {
      let expression = { op: 'foo' };
      let options = { id: 'abc123' };

      let query = new Query(expression, options);

      assert.strictEqual(query.id, options.id, 'id was populated');
      assert.deepEqual(query.expression, expression, 'expression was populated');
    });

    test('.from will return a query passed into it', function(assert) {
      let query = new Query();
      assert.strictEqual(Query.from(query), query);
    });

    test('.from will create a query from an expression passed into it', function(assert) {
      let query = Query.from({ op: 'foo' });
      assert.ok(query instanceof Query);
    });

    test('.from should call toQueryExpression() if available', function(assert) {
      const expression = oqe('records', 'planet');
      const queryFactory = {
        toQueryExpression() {
          return expression;
        }
      };

      const query = Query.from(queryFactory);
      assert.deepEqual(query.expression, expression, 'expression was populated');
    });
  });
});
