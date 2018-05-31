/**
 * Search service
 * Original code by: Adam Bard (https://github.com/adambard/angular-elasticsearch-demo)
 */

phoneControllers.factory('searchService', 
	['$q', 'esFactory', '$location', function($q, elasticsearch, $location) {
	var client = elasticsearch({
		host: $location.host() + ':9200'
	});


	var search = function(term, num_results) {

		if(!term) {
			return $q(function(resolve,reject) {
				var empty = [];
				resolve(empty);
			}); 
		}

		
		/* Without using $q.defer(), available in angular 1.3+ */
		/*return $q(function(resolve, reject) { 
			// var query = {
			// 	query_string: {
			// 		query: term,
			// 		default_operator:"AND"
			// 	}
			// };

			//Using matching prefix
			var query = {
				match_phrase_prefix: {
					_all: {
						query: term,
						max_expansions: 25
					}

				}
			};

			client.search({
				index: 'op',
				type: 'phone',
				body: {
					size: num_results,
					query: query
				}
			}).then(function(result) {
				var hits_in, hits_out = [];

				hits_in = (result.hits || {}).hits || [];

				for(var i=0; i<hits_in.length; i++) {
					hits_out.push(hits_in[i]._source);
				}

				resolve(hits_out);
			}, reject);
		});*/

		/* Using $q.defer() */
		var deferred = $q.defer();
		// var query = {
		//   query_string: {
		// 	query: term,
		// 	default_operator:"AND"
		//   }
		// };
		var query = {
			match_phrase_prefix: {
				_all: {
					query: term,
					max_expansions: 25
				}

			}
		};

		client.search({
			index: 'op',
			type: 'phone',
			body: {
				size: 100,
				// from: (offset || 0) * 10,
				query: query,
			},
		}).then(function(result) {
			var hits_in, hits_out = [];
			hits_in = (result.hits || {}).hits || [];
			for(var i=0; i<hits_in.length; i++) {
				hits_out.push(hits_in[i]._source);
			}

			deferred.resolve(hits_out);
		}, deferred.reject);

		return deferred.promise;

	};

		// Since this is a factory method, we return an object representing the actual service.
		return {
			"search": search
		};
	}]
);
